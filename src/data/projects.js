import { Zap, Brain, Users, TrendingUp, Code, Globe, Target, BarChart3, Lightbulb, Rocket } from 'lucide-react'

export const projects = [
  {
    id: 1,
    title: "JenoAI.com",
    summary: "Vibe Marketing Platform for SMBs",
    demo: "https://jenoai.com",
    github: null,
    tags: ["React + Node", "Langgraph JS", "Pinecone DB", "AWS ECS"],
    role: "Co-founder & Product Lead",
    featured: true,
    icon: Zap
  },
  {
    id: 2,
    title: "PMFlow",
    summary: "Vibe Research Platform for Product Managers",
    demo: "https://pmflow-9f370.web.app/",
    github: null,
    tags: ["React + Node", "Deerflow", "Langgraph", "AWS ECS"],
    role: "Co-founder & Product Lead",
    featured: true,
    icon: Brain
  },
  {
    id: 3,
    title: "MediScribe",
    summary: "Medical Grade Transcription Tool for Pharmacies",
    demo: "https://studio--mediscribe-mvp-cmvq9.us-central1.hosted.app/",
    github: null,
    tags: ["Google MedGemma", "Vision AI", "Firebase", "React + Vite"],
    role: "Co-founder & Product Lead",
    featured: true,
    icon: Code
  },
  {
    id: 4,
    title: "Lumen",
    summary: "AI Tutor for K12 Students",
    demo: "https://lumen-b49e3.web.app/",
    github: null,
    tags: ["React + Node", "Pinecone", "Langgraph", "AWS ECS", "Firebase"],
    role: "Co-founder & Product Lead",
    featured: false,
    icon: Users
  },

  {
    id: 5,
    title: "AI Reskilling Agent",
    summary: "Personalized learning companion that adapts to individual learning styles and career goals",
    demo: "https://reskilling-agent.lovable.app",
    github: "https://github.com/somnath/ai-reskilling-agent",
    tags: ["AI", "Education", "Personalization", "Learning"],
    role: "Product Lead",
    featured: false,
    icon: Users
  },
  {
    id: 6,
    title: "Retool Internal Tools @ Postman",
    summary: "Built 15+ internal tools that improved team productivity by 40% and reduced manual work by 60%",
    demo: null,
    github: null,
    tags: ["Retool", "Internal Tools", "Productivity", "Automation"],
    role: "Product Manager",
    featured: false,
    icon: Code
  },
  {
    id: 7,
    title: "Growth Experiments @ Postman",
    summary: "Led 50+ A/B tests that increased user activation by 25% and reduced churn by 15%",
    demo: null,
    github: null,
    tags: ["Growth", "A/B Testing", "Analytics", "Optimization"],
    role: "Growth Manager",
    featured: false,
    icon: TrendingUp
  },
  {
    id: 8,
    title: "Community-led Growth @ Postman",
    summary: "Built and scaled developer community from 0 to 100K+ members, driving 30% of new user acquisition",
    demo: null,
    github: null,
    tags: ["Community", "Growth", "Developer Relations", "Content"],
    role: "Community Manager",
    featured: false,
    icon: Globe
  },
  {
    id: 9,
    title: "Product Analytics Dashboard",
    summary: "Comprehensive analytics platform that tracks user behavior, feature adoption, and business metrics",
    demo: null,
    github: "https://github.com/somnath/product-analytics",
    tags: ["Analytics", "Dashboard", "Data Visualization", "Product"],
    role: "Product Manager",
    featured: false,
    icon: BarChart3
  },
  {
    id: 10,
    title: "AI-Powered Customer Support",
    summary: "Intelligent chatbot that handles 80% of customer inquiries automatically, reducing response time by 90%",
    demo: null,
    github: "https://github.com/somnath/ai-support",
    tags: ["AI", "Customer Support", "Automation", "Chatbot"],
    role: "Product Lead",
    featured: false,
    icon: Target
  }
]

export const featuredProjects = projects.filter(p => p.featured).slice(0, 4) 