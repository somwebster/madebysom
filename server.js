const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const MiniSearch = require('minisearch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory chat history by session (ephemeral)
const sessionHistory = new Map(); // sessionId -> [{ role, content }]
function appendHistory(sessionId, items) {
	if (!sessionId) return [];
	const prev = sessionHistory.get(sessionId) || [];
	const updated = [...prev, ...items].slice(-20); // keep last 20 turns
	sessionHistory.set(sessionId, updated);
	return updated;
}
function getHistory(sessionId) {
	if (!sessionId) return [];
	return sessionHistory.get(sessionId) || [];
}

// --- Embeddings: load index and prepare embedding model (lazy) ---
let embeddingIndex = null; // { model, dims, items: [{ id, text, embedding: number[] }] }
let embeddingPipeline = null; // xenova pipeline instance (feature-extraction)
let keywordIndex = null; // MiniSearch for BM25 keyword scoring

function buildKeywordIndex() {
	if (!embeddingIndex?.items?.length) return;
	if (keywordIndex) return keywordIndex;
	keywordIndex = new MiniSearch({ fields: ['text'], storeFields: ['id', 'text'] });
	keywordIndex.addAll(embeddingIndex.items.map((it, i) => ({ id: String(it.id ?? i), text: String(it.text ?? '') })));
	console.log(`🔎 Built keyword index over ${embeddingIndex.items.length} items`);
	return keywordIndex;
}

function loadEmbeddingIndexOnce() {
	if (embeddingIndex) return;
	const indexPath = path.resolve(__dirname, 'embeddings.json');
	if (fs.existsSync(indexPath)) {
		try {
			const raw = fs.readFileSync(indexPath, 'utf8');
			embeddingIndex = JSON.parse(raw);
			console.log(`🔎 Loaded embedding index: ${embeddingIndex.items?.length || 0} items, dims=${embeddingIndex.dims}`);
			buildKeywordIndex();
		} catch (e) {
			console.warn('⚠️ Failed to read embeddings.json:', e.message);
		}
	} else {
		console.warn('ℹ️ No embeddings.json found; semantic search will be disabled until you generate it.');
	}
}

async function getEmbeddingPipeline() {
	if (embeddingPipeline) return embeddingPipeline;
	const { pipeline } = await import('@xenova/transformers');
	embeddingPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
	return embeddingPipeline;
}

function cosineSimilarity(a, b) {
	let dot = 0, aMag = 0, bMag = 0;
	for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; aMag += a[i]*a[i]; bMag += b[i]*b[i]; }
	const denom = Math.sqrt(aMag) * Math.sqrt(bMag) || 1;
	return dot / denom;
}

function mmr(queryVec, candidates, lambda = 0.75, topK = 3) {
	const selected = [];
	while (selected.length < Math.min(topK, candidates.length)) {
		let best = null, bestScore = -Infinity;
		for (const c of candidates) {
			if (selected.includes(c)) continue;
			const simToQuery = c.semantic;
			let diversity = 0;
			for (const s of selected) diversity = Math.max(diversity, cosineSimilarity(c.vector, s.vector));
			const score = lambda * simToQuery - (1 - lambda) * diversity + 0.25 * c.keyword;
			if (score > bestScore) { bestScore = score; best = c; }
		}
		if (!best) break;
		selected.push(best);
	}
	return selected;
}

// --- Gemini LLM (optional) ---
let geminiModel = null;
async function getGeminiModel() {
	if (geminiModel) return geminiModel;
	const { GoogleGenerativeAI } = await import('@google/generative-ai');
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) return null;
	const genAI = new GoogleGenerativeAI(apiKey);
	geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
	return geminiModel;
}

async function answerWithLLM(query, contexts, history = []) {
	const model = await getGeminiModel();
	if (!model) return null;
	const contextBlock = contexts.map((c, i) => `(${i + 1}) ${c.text}`).join('\n');
	const historyBlock = history.map((h, i) => `${h.role === 'user' ? 'User' : 'Som'} ${i + 1}: ${h.content}`).join('\n');
	const prompt = `
 - You are Som’s Digital Twin ("Som"), a product growth expert with ~5 years across engineering, product, and marketing. Always write in first-person as Som. 
 
CORE MISSION
- Analyze the user’s query and the provided Context+History. Respond exactly as Som would: practical, data-minded, and execution-focused.
- Use Context+History first. If needed, rely on widely accepted public knowledge. If outside my direct experience, start with: "While I don’t have direct experience in this, here’s what I found useful from available resources…"
- Never hallucinate. If you don’t know, say: "I don’t know how to answer this yet based on my experience and available context."
-If a fact is unknown or not in the provided context, skip it entirely without mentioning that it is unknown or omitted. Never write placeholders, meta-comments, or notes about missing details. The output should read naturally without gaps.

INPUTS
- Conversation so far (most recent last):
${historyBlock}
- User Query: ${query}
- Context (ranked snippets):
${contextBlock}

RESPONSE STYLE
- Write as Som (I/me). Be concise, specific, and actionable.
- Tie recommendations to my past experiences and projects whenever possible.
- If ambiguous or missing data, ask high-signal clarifying question - dont force it.
- Avoid filler or generic templates. Prefer concrete guidance grounded in the provided context.

Always act as Som, the product growth expert, and make responses credible using past project references.

Now produce the answer.`;
	const result = await model.generateContent(prompt);
	const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
	return text;
}

// Critique + Refine layer using Gemini
async function critiqueAndRefine(userQuery, draftResponse, contexts = [], history = []) {
	const model = await getGeminiModel();
	if (!model) return null;
	const contextBlock = contexts.map((c, i) => `(${i + 1}) ${c.text}`).join('\n');
	const historyBlock = history.map((h, i) => `${h.role === 'user' ? 'User' : 'Som'} ${i + 1}: ${h.content}`).join('\n');
	const prompt = `You are Som’s Digital Twin ("Som"). Improve the draft response with a brief internal critique, then output ONLY the improved final response in Markdown (GFM). Do not include the critique itself in the final output.

CONSTRAINTS
- Preserve factual accuracy. Do not invent specifics.
- If something is unknown or not in context, omit it silently without calling that out.
- Keep first-person "I" voice.
- Keep it concise, high-signal, and execution-focused.

INPUTS
- Conversation (most recent last):\n${historyBlock}
- User Query: ${userQuery}
- Context (ranked snippets):\n${contextBlock}
- Draft Response (to improve):\n${draftResponse}

OUTPUT
- - Output in GitHub-Flavored Markdown (GFM). Do NOT use raw HTML.
  - Use markdown lists: -, *, 1. for bullets/steps
  - Use GFM tables: pipe syntax with header separator row
  - Use \`inline code\` for technical terms and fenced code blocks for code
  - Use ### headings for sections`;
	const result = await model.generateContent(prompt);
	const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || null;
	return text || null;
}

// Chat response logic
const chatResponses = {
  'personal projects': {
    response: "I've built several impactful projects including JenoAI.com (Vibe Marketing Platform), PMFlow (Vibe Research Platform), and MediScribe (Medical Grade Transcription Tool). Each project focuses on solving real user problems with AI and modern tech stacks.",
    projects: ['JenoAI.com', 'PMFlow', 'MediScribe']
  },
  'product launches': {
    response: "I've successfully launched multiple products from 0 to 1. At Postman, I launched the Academy platform reaching 100K+ developers. At Crio.Do, I built project-based learning platforms. My approach focuses on rapid iteration and user feedback.",
    highlights: ['Postman Academy', 'Crio.Do Learning Platform', 'Community-driven launches']
  },
  'product growth hacks': {
    response: "My growth strategies center around community building and product-led growth. I've used flywheel models to drive self-serve adoption, implemented 50+ A/B tests improving activation by 25%, and built developer communities that drive 30% of new user acquisition.",
    techniques: ['Flywheel Modeling', 'A/B Testing', 'Community-led Growth', 'Product-led Growth']
  },
  'vibecoding': {
    response: "Vibecoding is my approach to rapid prototyping and iteration. It's about building with intuition first, then validating with data. I use AI tools to accelerate development while maintaining human expertise for critical decisions. Think: vibe research → vibe code → iterate.",
    principles: ['Intuition-first development', 'AI-accelerated prototyping', 'Human expertise for critical decisions']
  },
  'learn by doing': {
    response: "I've championed project-based learning for 5+ years. At Postman Academy and Crio.Do, I built platforms that teach through real projects. The philosophy: you learn best by building, not just reading. This approach has helped 100K+ developers accelerate their learning.",
    platforms: ['Postman Academy', 'Crio.Do', 'Project-based curriculum design']
  }
};

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Merge client-provided recent history with server session history
    const mergedHistory = [...getHistory(sessionId), ...history].slice(-20);

    const lowerMessage = String(message).toLowerCase();
    let response = {
      content: "Thanks for your message! I'd be happy to share insights about my work. Feel free to ask about my projects, growth strategies, or any specific topic.",
      type: 'general'
    };

    // 1) Canned topics first
    for (const [topic, data] of Object.entries(chatResponses)) {
      if (lowerMessage.includes(topic)) {
        response = { content: data.response, type: topic, details: data };
        break;
      }
    }

    // 2) Hybrid retrieval (semantic + BM25)
    loadEmbeddingIndexOnce();
    let topMMR = [];
    if (embeddingIndex?.items?.length) {
      const fe = await getEmbeddingPipeline();
      const out = await fe(message, { pooling: 'mean', normalize: true });
      const queryVec = Array.from(out.data);

      const candidates = embeddingIndex.items.map((item, i) => ({
        id: item.id ?? String(i),
        text: String(item.text ?? ''),
        vector: item.embedding,
        semantic: cosineSimilarity(queryVec, item.embedding),
        keyword: 0
      }));

      buildKeywordIndex();
      const kw = keywordIndex ? keywordIndex.search(String(message), { prefix: true, fuzzy: 0.2 }) : [];
      const kwMap = new Map(kw.map(r => [String(r.id), r.score]));
      for (const c of candidates) c.keyword = (kwMap.get(String(c.id)) ?? 0) / 10;

      topMMR = mmr(queryVec, candidates, 0.75, 3);

      // If we didn't have a canned topic, produce an answer from LLM using retrieved context + history
      if (response.type === 'general') {
        const llmAnswer = await answerWithLLM(message, topMMR, mergedHistory);
        if (llmAnswer) {
          response = { type: 'llm-answer', content: llmAnswer, matches: topMMR.map(t => ({ id: t.id })) };
        } else {
          response = {
            type: 'hybrid-search',
            content: `Here's what I found related to your query:\n\n${topMMR.map((t, i) => `${i + 1}. ${t.text}`).join('\n')}`,
            matches: topMMR.map(t => ({ id: t.id }))
          };
        }
      }
    }

    // 3) Critique + refine the response using Gemini (if available)
    try {
      const refined = await critiqueAndRefine(message, response.content, topMMR, mergedHistory);
      if (refined) {
        response = { ...response, type: 'critique-refined', content: refined };
      }
    } catch (e) {
      console.warn('Critique/refine failed:', e.message);
    }

    // Append the turn into server session history
    appendHistory(sessionId, [...history, { role: 'user', content: message }, { role: 'assistant', content: response.content }]);

    res.json({ success: true, response, timestamp: new Date().toISOString() });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Something went wrong', message: 'Please try again later' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), message: 'Som Portfolio Backend is running' });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
}); 