import { motion } from 'framer-motion'
import { TrendingUp, Users, Globe, BookOpen, Sparkles } from 'lucide-react'

const MyStory = () => {
  const milestones = [
    {
      year: "2024-Present",
      title: "Senior Growth Manager @ Postman",
      description: "Leading growth initiatives and building AI-powered learning platforms for Postman Academy.",
      icon: TrendingUp
    },
    {
      year: "2022-2024",
      title: "Growth Manager @ Postman",
      description: "Managed student programs, built internal tools, and drove community growth initiatives.",
      icon: Users
    },
    {
      year: "2021-2022",
      title: "Student Community Manager @ Postman",
      description: "Led the Classroom Program for APAC region, building developer communities.",
      icon: Globe
    },
    {
      year: "2020-2021",
      title: "Growth/Product @ Crio.Do",
      description: "Managed developer community in India and built project-based learning platforms.",
      icon: BookOpen
    },
    {
      year: "2017-2020",
      title: "Co-Founder @ Fnplus Tech",
      description: "Built educational technology solutions and developer community platforms.",
      icon: Sparkles
    }
  ]

  return (
    <section className="py-20 px-6">
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
          <p className="text-xl text-white/90 leading-relaxed">
            From software development to growth leadership, my journey has been driven by a passion for building products that scale.
          </p>
        </motion.div>

        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-6 p-6 card-bg rounded-xl hover:glow-border transition-all duration-300 hover:scale-105"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <milestone.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <div className="text-yellow-300 font-mono text-sm mb-1">{milestone.year}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{milestone.title}</h3>
                <p className="text-white/80 leading-relaxed">{milestone.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MyStory 