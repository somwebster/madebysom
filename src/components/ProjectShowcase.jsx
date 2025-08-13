import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

const ProjectShowcase = ({ projects }) => {
  const [activeFilter, setActiveFilter] = useState('All')
  
  const allTags = ['All', ...new Set(projects.flatMap(p => p.tags))]
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(p => p.tags.includes(activeFilter))

  return (
    <section id="projects" className="py-20 px-6">
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
          
          {/* Filter Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === tag
                    ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 text-white'
                    : 'card-bg text-white hover:bg-yellow-400/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`p-6 rounded-xl transition-all duration-300 hover:scale-105 ${
                project.featured 
                  ? 'card-bg glow-border' 
                  : 'card-bg hover:glow-border'
              }`}
            >
              <div className="mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                    <project.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                </div>
                <p className="text-white/80 text-sm mb-3">{project.summary}</p>
                <p className="text-yellow-300 text-xs font-medium">{project.role}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-white/20 text-xs rounded-full text-white border border-yellow-400/30">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-200 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Demo</span>
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-green-300 hover:text-green-200 text-sm transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
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

export default ProjectShowcase 