import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Download, Heart } from 'lucide-react'

const Contact = () => {
  return (
    <>
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              Let's <span className="electric-text">Connect</span>
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Interested in growth? I'm always open to discussing new opportunities, collaborations, or sharing insights about product-led growth.
            </p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <a
                href="mailto:som.official01@gmail.com"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 hover:from-yellow-300 hover:via-green-300 hover:to-blue-400 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 glow-border animate-pulse-glow"
              >
                <Mail className="w-5 h-5" />
                <span>Get In Touch</span>
              </a>
              <a
                href="https://linkedin.com/in/somnath"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 card-bg hover:bg-green-400/30 px-8 py-4 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
                <span>Connect on LinkedIn</span>
              </a>
            </div>

            <div className="flex justify-center space-x-6">
              <a href="https://github.com/somnath" target="_blank" rel="noopener noreferrer" 
                 className="p-3 rounded-full card-bg hover:bg-yellow-400/30 transition-all duration-300 hover:scale-110">
                <Github className="w-6 h-6 text-white" />
              </a>
              <a href="mailto:som.official01@gmail.com" 
                 className="p-3 rounded-full card-bg hover:bg-green-400/30 transition-all duration-300 hover:scale-110">
                <Mail className="w-6 h-6 text-white" />
              </a>
              <a href="/resume.pdf" download
                 className="p-3 rounded-full card-bg hover:bg-blue-400/30 transition-all duration-300 hover:scale-110">
                <Download className="w-6 h-6 text-white" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/80">
            Built with <Heart className="inline w-4 h-4 text-red-400 animate-pulse" /> by Som Nath
          </p>
        </div>
      </footer>
    </>
  )
}

export default Contact 