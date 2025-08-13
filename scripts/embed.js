#!/usr/bin/env node

// Lightweight CSV → embeddings generator using a local model (no API keys needed)
// Usage:
//   node scripts/embed.js --input data.csv --output embeddings.json --text-col text --id-col id
// Defaults:
//   input=data.csv, output=embeddings.json, text-col=text, id-col=id

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

async function loadPipeline() {
	const { pipeline } = await import('@xenova/transformers');
	return pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
}

function parseArgs() {
	const args = process.argv.slice(2);
	const opts = { input: 'data.csv', output: 'embeddings.json', textCol: 'text', idCol: 'id' };
	for (let i = 0; i < args.length; i += 2) {
		const key = args[i];
		const val = args[i + 1];
		if (!val) continue;
		if (key === '--input') opts.input = val;
		if (key === '--output') opts.output = val;
		if (key === '--text-col') opts.textCol = val;
		if (key === '--id-col') opts.idCol = val;
	}
	return opts;
}

function l2Normalize(vector) {
	const norm = Math.sqrt(vector.reduce((acc, v) => acc + v * v, 0)) || 1;
	return vector.map(v => v / norm);
}

async function main() {
	const { input, output, textCol, idCol } = parseArgs();
	const inputPath = path.resolve(process.cwd(), input);
	const outputPath = path.resolve(process.cwd(), output);

	if (!fs.existsSync(inputPath)) {
		console.error(`Input CSV not found: ${inputPath}`);
		process.exit(1);
	}

	const csvRaw = fs.readFileSync(inputPath, 'utf8');
	const rows = parse(csvRaw, { columns: true, skip_empty_lines: true });
	if (!rows.length) {
		console.error('CSV has no rows.');
		process.exit(1);
	}
	if (!(textCol in rows[0])) {
		console.error(`CSV missing required text column: ${textCol}`);
		process.exit(1);
	}

	console.log(`Loaded ${rows.length} rows from ${input}`);
	console.log('Loading embedding model (Xenova/all-MiniLM-L6-v2)...');
	const fe = await loadPipeline();
	console.log('Model ready. Generating embeddings...');

	const results = [];
	for (let i = 0; i < rows.length; i++) {
		const row = rows[i];
		const id = row[idCol] ?? String(i);
		const text = String(row[textCol] ?? '').trim();
		if (!text) continue;

		// Compute embedding
		const output = await fe(text, { pooling: 'mean', normalize: false });
		const embedding = Array.from(output.data);
		const normalized = l2Normalize(embedding);

		results.push({ id, text, embedding: normalized });
		if ((i + 1) % 10 === 0) console.log(`Embedded ${i + 1}/${rows.length} rows`);
	}

	fs.writeFileSync(outputPath, JSON.stringify({ model: 'Xenova/all-MiniLM-L6-v2', dims: results[0]?.embedding?.length || 384, items: results }, null, 2));
	console.log(`Saved ${results.length} embeddings → ${output}`);
}

main().catch(err => {
	console.error('Error generating embeddings:', err);
	process.exit(1);
}); 