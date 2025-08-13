const { useState, useEffect, useRef } = React;
const { motion } = window.Motion;

// Simple icon components that work reliably
const MessageCircle = () => React.createElement('span', { className: 'text-white text-lg' }, '💬');
const ExternalLink = () => React.createElement('span', { className: 'text-white text-lg' }, '🔗');
const Github = () => React.createElement('span', { className: 'text-white text-lg' }, '🐙');
const Send = () => React.createElement('span', { className: 'text-white text-lg' }, '→');
const Linkedin = () => React.createElement('span', { className: 'text-white text-lg' }, '💼');
const Mail = () => React.createElement('span', { className: 'text-white text-lg' }, '✉️');
const Code = () => React.createElement('span', { className: 'text-white text-lg' }, '💻');
const Palette = () => React.createElement('span', { className: 'text-white text-lg' }, '🎨');
const TrendingUp = () => React.createElement('span', { className: 'text-white text-lg' }, '📈');
const X = () => React.createElement('span', { className: 'text-white text-lg' }, '✕');
const ChevronDown = () => React.createElement('span', { className: 'text-white text-lg' }, '↓');

const ProjectChat = ({ featuredProjects, isHero = false }) => {
  const [selectedProject, setSelectedProject] = useState(featuredProjects[0])
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [typedText, setTypedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const chatScrollRef = useRef(null)
  const messagesEndRef = useRef(null)
  const [sessionId] = useState(() => {
    try {
      const existing = sessionStorage.getItem('chat_session_id')
      if (existing) return existing
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
      sessionStorage.setItem('chat_session_id', id)
      return id
    } catch {
      return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`
    }
  })

  const quotes = [
    "I bring 5+ years of experience across EdTech and B2B SaaS industries.",
    "I launched my first community startup — Fnplus — during undergrad to help peers build together.",
    "I helped build 'Insitfy' which crossed 10,000+ downloads and 4.5★ rating on the Play Store.",
    "I've championed 'learning by doing' by launching project-based learning at Postman Academy and Crio.Do.",
    "From 0 to 1 — I've built programs, launched platforms, and scaled learning communities globally."
  ]

  const topics = [
    "Product Led Growth",
    "AI Agents", 
    "Community building",
    "Vibecoding",
    "Learn by Doing"
  ]

  // Auto-rotate quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [quotes.length])

  // Typing animation for topics
  useEffect(() => {
    const currentTopic = topics[currentTopicIndex]
    let currentCharIndex = 0
    setTypedText('')
    setIsTyping(true)

    const typeInterval = setInterval(() => {
      if (currentCharIndex < currentTopic.length) {
        setTypedText(currentTopic.slice(0, currentCharIndex + 1))
        currentCharIndex++
      } else {
        setIsTyping(false)
        clearInterval(typeInterval)
        
        setTimeout(() => {
          setCurrentTopicIndex((prev) => (prev + 1) % topics.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [currentTopicIndex])

  // Auto-scroll to bottom when messages or loading state change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isLoading, showChat])

  const handleSend = async (overrideMessage) => {
    const text = (overrideMessage ?? inputValue).trim()
    if (text && !isLoading) {
      setIsLoading(true)
      setShowChat(true)
      
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: text,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, userMessage])
      const currentInput = text
      if (!overrideMessage) setInputValue('')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sessionId,
            message: currentInput,
            history: messages.slice(-12).map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content }))
          })
        })

        const data = await response.json()
        
        if (data.success) {
          const botMessage = {
            id: messages.length + 2,
            type: 'bot',
            content: data.response.content,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botMessage])
        } else {
          throw new Error(data.error || 'Failed to get response')
        }
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage = {
          id: messages.length + 2,
          type: 'bot',
          content: "Sorry, I'm having trouble responding right now. Please try again later.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      content: `Tell me about ${project.title}`,
      timestamp: new Date()
    }
    const botResponse = {
      id: messages.length + 2,
      type: 'bot',
      content: `${project.summary}`,
      project: project,
      timestamp: new Date()
    }
    setMessages([...messages, newMessage, botResponse])
  }

  const chatContent = (
    <div className="w-full h-screen flex flex-col relative z-10">
      {!showChat ? (
        /* Profile View */
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl"
          >
            {/* Animated Quotes */}
            <div className="mb-6 sm:mb-8 h-12 sm:h-16 flex items-center justify-center">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center"
              >
                <p className="text-white/80 text-xs sm:text-sm md:text-base italic leading-relaxed max-w-xs sm:max-w-md md:max-w-lg px-2">
                  "{quotes[currentQuoteIndex]}"
                </p>
              </motion.div>
            </div>

            {/* Profile Image */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <div className="relative inline-block">
                <img 
                  src="/Som.png" 
                  alt="Som Nath" 
                  className="max-w-32 sm:max-w-40 md:max-w-48 lg:max-w-56"
                />
              </div>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 text-white">
              Hi, I'm <span className="electric-text">Som</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 sm:mb-8 leading-relaxed px-2">
              A <span className="text-yellow-300 font-semibold">Builder</span> with cross-functional experience across <span className="inline-flex items-center"><Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-400" />Engineering</span>, <span className="inline-flex items-center"><Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-400" />Design</span>, and <span className="inline-flex items-center"><TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-400" />Product Growth</span>.
            </p>
            
            {/* Quick Action Buttons */}
            <div className="mb-4 sm:mb-6">
              <div className="w-full px-2 sm:px-4 text-center">
                <div className="flex flex-wrap justify-center items-center gap-2 mx-auto">
                  {[
                    "Personal Projects",
                    "Product Launches", 
                    "Product Growth Hacks",
                    "VibeCoding Tips",
                   
                  ].map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(`Tell me about your ${action}`)}
                      className="px-2 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-yellow-400/50 shadow-sm hover:shadow-yellow-400/20 leading-tight whitespace-normal"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="mb-6 sm:mb-8">
              <div className="w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto px-2">
                <div className="relative">
                  {/* Mobile: two-line textarea */}
                  <textarea
                    rows={2}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder=""
                    className="block sm:hidden w-full px-4 py-3 bg-white/80 border border-white/50 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 transition-all duration-300 text-sm shadow-lg shadow-yellow-400/20 resize-none"
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                  {/* Desktop: single-line input */}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder=""
                    className="hidden sm:block w-full px-6 py-4 bg-white/80 border border-white/50 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 transition-all duration-300 text-lg shadow-lg shadow-yellow-400/20"
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  {!isInputFocused && (
                    <div className="absolute inset-0 flex items-center justify-center sm:justify-start sm:pl-6 pointer-events-none">
                      <div className="block sm:hidden text-gray-600 text-sm leading-snug">
                        <div>Ask me anything about</div>
                        <div>
                          <span className="bg-gradient-to-r from-yellow-500 via-green-500 to-blue-600 bg-clip-text text-transparent font-semibold">{typedText}</span>
                          <span className={`inline-block w-0.5 h-4 bg-yellow-500 ml-1 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                        </div>
                      </div>
                      <span className="hidden sm:inline text-gray-600 text-lg">
                        Ask me anything about <span className="bg-gradient-to-r from-yellow-500 via-green-500 to-blue-600 bg-clip-text text-transparent font-semibold">{typedText}</span>
                        <span className={`inline-block w-0.5 h-5 bg-yellow-500 ml-1 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                      </span>
                    </div>
                  )}
                  <button 
                    onClick={handleSend}
                    disabled={isLoading}
                    className="absolute right-2 sm:right-3 bottom-2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 p-1.5 sm:p-2 bg-black border border-gray-300 hover:border-yellow-400 rounded-full transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 disabled:opacity-50"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <motion.div 
              className="flex justify-center space-x-3 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a href="https://github.com/somwebster" target="_blank" rel="noopener noreferrer" 
                 className="p-1.5 sm:p-2 rounded-full card-bg hover:bg-yellow-400/30 transition-all duration-300 hover:scale-110">
                <Github className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a href="https://linkedin.com/in/somwebster" target="_blank" rel="noopener noreferrer"
                 className="p-1.5 sm:p-2 rounded-full card-bg hover:bg-green-400/30 transition-all duration-300 hover:scale-110">
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
              <a href="mailto:som.official01@gmail.com" 
                 className="p-1.5 sm:p-2 rounded-full card-bg hover:bg-blue-400/30 transition-all duration-300 hover:scale-110">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </a>
            </motion.div>


          </motion.div>
        </div>
      ) : (
        /* Chat View */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-yellow-400/20 via-green-400/20 to-blue-500/20 p-4 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Chat with Som</h3>
                  <p className="text-white/70 text-sm">Ask me anything about my work</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatScrollRef}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.type === 'user' ? 'bg-blue-500/20' : 'bg-white/10'} rounded-lg p-3`}>
                  {message.type === 'bot' ? (
                    <div className="prose prose-invert prose-sm max-w-none text-white">
                      <div 
                          className="rich-content"
                          dangerouslySetInnerHTML={{ 
                            __html: (window.marked ? window.marked.parse(message.content) : message.content)
                          }} 
                        />
                    </div>
                  ) : (
                    <p className="text-white text-sm">{message.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-400/50 transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="px-4 py-2 bg-black border border-gray-300 hover:border-yellow-400 rounded-lg transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50 disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (isHero) {
    return chatContent
  }

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Featured <span className="electric-text">Projects</span>
          </h2>
          <p className="text-xl text-white/90 mb-12">
            My top projects that showcase growth, AI, and product leadership
          </p>
        </motion.div>

        {chatContent}
      </div>
    </section>
  )
}

// Sample projects data
const featuredProjects = [
  {
    id: 1,
    title: "JenoAI.com",
    summary: "Vibe Marketing Platform for SMBs",
    demo: "https://jenoai.com",
    github: null,
    tags: ["React + Node", "Langgraph JS", "Pinecone DB", "AWS ECS"],
    role: "Co-founder & Product Lead",
    featured: true
  },
  {
    id: 2,
    title: "PMFlow",
    summary: "Vibe Research Platform for Product Managers",
    demo: "https://pmflow-9f370.web.app/",
    github: null,
    tags: ["React + Node", "Deerflow", "Langgraph", "AWS ECS"],
    role: "Co-founder & Product Lead",
    featured: true
  },
  {
    id: 3,
    title: "MediScribe",
    summary: "Medical Grade Transcription Tool for Pharmacies",
    demo: "https://studio--mediscribe-mvp-cmvq9.us-central1.hosted.app/",
    github: null,
    tags: ["Google MedGemma", "Vision AI", "Firebase", "React + Vite"],
    role: "Co-founder & Product Lead",
    featured: true
  }
];

// All projects data
const allProjects = [
  {
    id: 1,
    title: "JenoAI.com",
    summary: "Vibe Marketing Platform for SMBs",
    demo: "https://jenoai.com",
    github: null,
    tags: ["React + Node", "Langgraph JS", "Pinecone DB", "AWS ECS"],
    role: "Co-founder & Product Lead",
    featured: true
  },
  {
    id: 2,
    title: "PMFlow",
    summary: "Vibe Research Platform for Product Managers",
    demo: "https://pmflow-9f370.web.app/",
    github: null,
    tags: ["React + Node", "Deerflow", "Langgraph", "AWS ECS"],
    role: "Co-founder & Product Lead",
    featured: true
  },
  {
    id: 3,
    title: "MediScribe",
    summary: "Medical Grade Transcription Tool for Pharmacies",
    demo: "https://studio--mediscribe-mvp-cmvq9.us-central1.hosted.app/",
    github: null,
    tags: ["Google MedGemma", "Vision AI", "Firebase", "React + Vite"],
    role: "Co-founder & Product Lead",
    featured: true
  },
  {
    id: 4,
    title: "Lumen",
    summary: "AI Tutor for K12 Students",
    demo: "https://lumen-b49e3.web.app/",
    github: null,
    tags: ["React + Node", "Pinecone", "Langgraph", "AWS ECS", "Firebase"],
    role: "Co-founder & Product Lead",
    featured: false
  },
  {
    id: 5,
    title: "AI Reskilling Agent",
    summary: "Personalized learning companion that adapts to individual learning styles and career goals",
    demo: "https://reskilling-agent.lovable.app",
    github: "https://github.com/somnath/ai-reskilling-agent",
    tags: ["AI", "Education", "Personalization", "Learning"],
    role: "Product Lead",
    featured: false
  },
  {
    id: 6,
    title: "Retool Internal Tools @ Postman",
    summary: "Built 15+ internal tools that improved team productivity by 40% and reduced manual work by 60%",
    demo: null,
    github: null,
    tags: ["Retool", "Internal Tools", "Productivity", "Automation"],
    role: "Product Manager",
    featured: false
  },
  {
    id: 7,
    title: "Growth Experiments @ Postman",
    summary: "Led 50+ A/B tests that increased user activation by 25% and reduced churn by 15%",
    demo: null,
    github: null,
    tags: ["Growth", "A/B Testing", "Analytics", "Optimization"],
    role: "Growth Manager",
    featured: false
  },
  {
    id: 8,
    title: "Community-led Growth @ Postman",
    summary: "Built and scaled developer community from 0 to 100K+ members, driving 30% of new user acquisition",
    demo: null,
    github: null,
    tags: ["Community", "Growth", "Developer Relations", "Content"],
    role: "Community Manager",
    featured: false
  },
  {
    id: 9,
    title: "Product Analytics Dashboard",
    summary: "Comprehensive analytics platform that tracks user behavior, feature adoption, and business metrics",
    demo: null,
    github: "https://github.com/somnath/product-analytics",
    tags: ["Analytics", "Dashboard", "Data Visualization", "Product"],
    role: "Product Manager",
    featured: false
  },
  {
    id: 10,
    title: "AI-Powered Customer Support",
    summary: "Intelligent chatbot that handles 80% of customer inquiries automatically, reducing response time by 90%",
    demo: null,
    github: "https://github.com/somnath/ai-support",
    tags: ["AI", "Customer Support", "Automation", "Chatbot"],
    role: "Product Lead",
    featured: false
  }
];

// Beliefs data
const beliefs = [
  "When I started in software engineering, one quote from Linus Torvalds stuck with me: \"Talk is cheap — show me the code.\" Today, everyone is a builder, I'd rephrase it as: \"Talk is cheap — show me what you built.\"",
  "For the last five years, I've advocated for project-based learning for developers worldwide—the only way to truly learn is by doing. And there's never been a better time to build than now, with the lines between engineer, designer, and product manager blurred, and AI as an essential tool for every builder.",
  "Vibe research, then vibe code, then iterate. Don't just build for the sake of building—solve real user problems. Use AI for research, but validate with real human conversations.",
  "Decision-first, data-second. We live in the most data-rich era, but great outcomes start with clarity on the decisions you want to make—then find the data that matters.",
  "Think in systems. Even if you're not technical, learn how systems work. Understand system design and, more importantly, where \"vibecoding\" ends and human expertise is required.",
  "Make yourself superhuman. Use AI to upgrade your workflows, remove bottlenecks, and move fast. AI isn't magic—it's leverage, and knowing how to wield it makes all the difference."
];

// Capabilities data
const capabilities = [
  {
    title: "Software Engineering",
    description: "Proven track record in building and integrating AI/ML systems into production environments, ensuring scalability, reliability, and real-world impact."
  },
  {
    title: "Product-Led Growth",
    description: "Experience in designing and executing flywheel models that drive self-serve product adoption, retention, and sustainable growth."
  },
  {
    title: "Data Analytics",
    description: "End-to-end experience in building data pipelines, visualization tools, and predictive models—passionate about using data for better decision making."
  },
  {
    title: "Community Building",
    description: "Skilled at creating and scaling developer communities that fuel product adoption, foster feedback loops, and accelerate innovation."
  }
];

// Journey data
const journey = [
  {
    year: "2024",
    title: "Co-founder & Product Lead",
    company: "JenoAI.com",
    description: "Building AI-powered marketing platform for SMBs, leading product strategy and technical implementation."
  },
  {
    year: "2023",
    title: "Product Manager",
    company: "Postman",
    description: "Led growth experiments, built internal tools, and scaled developer community to 100K+ members."
  },
  {
    year: "2022",
    title: "Community Manager",
    company: "Postman",
    description: "Built and scaled developer community from 0 to 100K+ members, driving 30% of new user acquisition."
  },
  {
    year: "2021",
    title: "Growth Manager",
    company: "Postman",
    description: "Led 50+ A/B tests that increased user activation by 25% and reduced churn by 15%."
  },
  {
    year: "2020",
    title: "Co-founder",
    company: "Fnplus",
    description: "Launched community startup during undergrad to help peers build together, reaching 10K+ developers."
  },
  {
    year: "2019",
    title: "Android Developer",
    company: "Insitfy",
    description: "Built Android app that crossed 10,000+ downloads and earned a 4.5★ rating on the Play Store."
  }
];

// What I Believe Section Component
const BeliefsAndCapabilities = () => {
  return (
    <section id="beliefs" className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* What I Believe */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white text-center">
            What I <span className="electric-text">Believe</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Image and First Two Beliefs */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <img 
                  src="/presentation.png" 
                  alt="Presentation" 
                  className="max-w-full h-auto rounded-lg shadow-2xl"
                />
              </motion.div>
              
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-white/90 text-lg leading-relaxed"
                >
                  {beliefs[0]}
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-white/90 text-lg leading-relaxed"
                >
                  {beliefs[1]}
                </motion.div>
              </div>
            </div>
            
            {/* Right Column - Belief Cards */}
            <div className="space-y-6">
              {beliefs.slice(2).map((belief, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-bg p-6 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
                >
                  <p className="text-white/90 leading-relaxed">
                    <span className="font-semibold text-yellow-300">{belief.split('.')[0]}.</span>
                    {belief.split('.').slice(1).join('.')}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Core Competencies */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">
            Core <span className="electric-text">Competencies</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-bg p-6 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-yellow-300 mb-3">
                  {capability.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {capability.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// All Projects Section Component
const AllProjects = () => {
  return (
    <section id="projects" className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            All <span className="electric-text">Projects</span>
          </h2>
          <p className="text-xl text-white/90 mb-12">
            A comprehensive showcase of my work across different domains
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-bg p-6 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-yellow-300 mb-2">
                  {project.role}
                </p>
                <p className="text-white/80 text-sm leading-relaxed mb-4">
                  {project.summary}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-2">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-sm rounded-lg transition-all duration-300 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Demo
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-all duration-300 flex items-center gap-1"
                  >
                    <Github className="w-3 h-3" />
                    Code
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// My Journey Section Component
const MyJourney = () => {
  return (
    <section id="journey" className="py-20 px-6 relative">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            My <span className="electric-text">Journey</span>
          </h2>
          <p className="text-xl text-white/90 mb-12">
            From Android developer to AI-powered product leader
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 via-green-400 to-blue-500"></div>
          
          {journey.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative mb-12 ml-16"
            >
              {/* Timeline dot */}
              <div className="absolute -left-8 top-2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full border-2 border-white"></div>
              
              <div className="card-bg p-6 rounded-lg border border-white/10 hover:border-yellow-400/30 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-yellow-300 font-medium">
                      {item.company}
                    </p>
                  </div>
                  <span className="text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                    {item.year}
                  </span>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main App Component
const App = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
              <section className="relative min-h-screen overflow-hidden flex flex-col min-h-screen">
        {/* Celestial background elements */}
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        <ProjectChat featuredProjects={featuredProjects} isHero={true} />
      </section>
      
      {/* Hidden Sections - Commented out for now */}
      {/* 
      <BeliefsAndCapabilities />
      <AllProjects />
      <MyJourney />
      */}
    </div>
  )
}

// Render the app
ReactDOM.render(<App />, document.getElementById('root')); 