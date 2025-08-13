import { motion } from 'framer-motion'
import { Star, TrendingUp, Code, BarChart3, Users } from 'lucide-react'

const BeliefsAndCapabilities = ({ beliefs, capabilities }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white text-center">
            What I <span className="electric-text">Believe</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Image and Description */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Presentation Image */}
              <div className="text-center">
                <img 
                  src="/presentation.png" 
                  alt="Presentation" 
                  className="max-w-full h-auto rounded-xl glow-border"
                />
              </div>
              
              {/* Description section for first two beliefs */}
              <div className="space-y-6">
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {beliefs[0]}
                </p>
                <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                  {beliefs[1]}
                </p>
              </div>
            </motion.div>

            {/* Right Column - Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {beliefs.slice(2).map((belief, index) => {
                const lines = belief.split('. ');
                const firstLine = lines[0];
                const restOfText = lines.slice(1).join('. ');
                
                return (
                  <motion.div
                    key={index + 2}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-6 card-bg rounded-xl hover:glow-border transition-all duration-300 hover:scale-105"
                  >
                    <div className="text-lg text-white leading-relaxed">
                      <span className="font-bold text-yellow-300">{firstLine}.</span>
                      {restOfText && <span> {restOfText}</span>}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-white">
            Core <span className="electric-text">Competencies</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 card-bg rounded-xl text-center hover:glow-border transition-all duration-300 hover:scale-105 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <capability.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{capability.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BeliefsAndCapabilities 