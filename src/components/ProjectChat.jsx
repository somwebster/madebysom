import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, ExternalLink, Github, Send, Linkedin, Mail, Code, Palette, TrendingUp, X, ChevronDown } from 'lucide-react'

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

  const quotes = [
    "I bring 5+ years of experience across EdTech and B2B SaaS industries.",
    "I launched my first community startup — Fnplus — during undergrad to help peers build together.",
    "My Android app 'Insitfy' crossed 10,000+ downloads and earned a 4.5★ rating on the Play Store.",
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
    }, 4000) // Change quote every 4 seconds

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
        
        // Wait before starting next topic
        setTimeout(() => {
          setCurrentTopicIndex((prev) => (prev + 1) % topics.length)
        }, 2000) // Wait 2 seconds before next topic
      }
    }, 100) // Type each character every 100ms

    return () => clearInterval(typeInterval)
  }, [currentTopicIndex])

  const handleSend = () => {
    if (inputValue.trim()) {
      setShowChat(true)
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputValue,
        timestamp: new Date()
      }
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: `Thanks for asking about "${inputValue}"! I'd be happy to share my insights on that topic.`,
        timestamp: new Date()
      }
      setMessages([...messages, newMessage, botResponse])
      setInputValue('')
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
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl"
          >
          {/* Animated Quotes */}
          <div className="mb-8 h-16 flex items-center justify-center">
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <p className="text-white/80 text-sm md:text-base italic leading-relaxed max-w-lg">
                "{quotes[currentQuoteIndex]}"
              </p>
            </motion.div>
          </div>

          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <img 
                src="/Som.png" 
                alt="Som Nath" 
                className="max-w-48 md:max-w-56"
              />
            </div>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Hi, I'm <span className="electric-text">Som</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
            I'm a <span className="text-yellow-300 font-semibold">Builder</span> with cross-functional experience across <span className="inline-flex items-center"><Code className="w-4 h-4 mr-1 text-blue-400" />Engineering</span>, <span className="inline-flex items-center"><Palette className="w-4 h-4 mr-1 text-green-400" />Design</span>, and <span className="inline-flex items-center"><TrendingUp className="w-4 h-4 mr-1 text-yellow-400" />Product Growth</span>.
          </p>
          
          {/* Quick Action Buttons */}
          <div className="mb-6">
            <div className="max-w-lg mx-auto">
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Personal Projects",
                  "Product Launches", 
                  "Product Growth Hacks",
                  "VibeCoding Tips",
                  "Awards and Recognitions"
                ].map((action, index) => (
                  <button
                    key={index}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-all duration-300 hover:scale-105 border border-white/20 hover:border-yellow-400/50 shadow-sm hover:shadow-yellow-400/20"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="mb-8">
            <div className="max-w-lg mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder=""
                  className="w-full px-6 py-4 bg-white/80 border border-white/50 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:border-yellow-400/50 transition-all duration-300 text-lg shadow-lg shadow-yellow-400/20"
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                {!isInputFocused && (
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <span className="text-gray-600 text-lg">
                      Ask me anything about <span className="bg-gradient-to-r from-yellow-500 via-green-500 to-blue-600 bg-clip-text text-transparent font-semibold">{typedText}</span>
                      <span className={`inline-block w-0.5 h-5 bg-yellow-500 ml-1 ${isTyping ? 'animate-pulse' : 'opacity-0'}`}></span>
                    </span>
                  </div>
                )}
                <button 
                  onClick={handleSend}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-black border border-gray-300 hover:border-yellow-400 rounded-full transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Social Links */}
          <motion.div 
            className="flex justify-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a href="https://github.com/somwebster" target="_blank" rel="noopener noreferrer" 
               className="p-2 rounded-full card-bg hover:bg-yellow-400/30 transition-all duration-300 hover:scale-110">
              <Github className="w-5 h-5 text-white" />
            </a>
            <a href="https://linkedin.com/in/somwebster" target="_blank" rel="noopener noreferrer"
               className="p-2 rounded-full card-bg hover:bg-green-400/30 transition-all duration-300 hover:scale-110">
              <Linkedin className="w-5 h-5 text-white" />
            </a>
            <a href="mailto:som.official01@gmail.com" 
               className="p-2 rounded-full card-bg hover:bg-blue-400/30 transition-all duration-300 hover:scale-110">
              <Mail className="w-5 h-5 text-white" />
            </a>
          </motion.div>

          {/* Scroll Down Arrow */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <ChevronDown 
                className="w-8 h-8 text-yellow-300 cursor-pointer hover:text-yellow-200 transition-colors duration-300"
                onClick={() => document.getElementById('beliefs')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      ) : (
        /* Chat View */
        <div className="flex-1 flex flex-col">
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.type === 'user' ? 'bg-blue-500/20' : 'bg-white/10'} rounded-lg p-3`}>
                  <p className="text-white text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
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
              />
              <button 
                onClick={handleSend}
                className="px-4 py-2 bg-black border border-gray-300 hover:border-yellow-400 rounded-lg transition-all duration-300 shadow-lg shadow-yellow-400/30 hover:shadow-yellow-400/50"
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

export default ProjectChat 