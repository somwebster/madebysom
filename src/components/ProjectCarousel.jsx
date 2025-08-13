import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Github } from 'lucide-react'

const ProjectCarousel = ({ featuredProjects, isHero = false }) => {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)

  const prevCarousel = () => {
    setCurrentCarouselIndex((prev) => 
      prev === 0 ? featuredProjects.length - 1 : prev - 1
    )
  }

  const nextCarousel = () => {
    setCurrentCarouselIndex((prev) => 
      prev === featuredProjects.length - 1 ? 0 : prev + 1
    )
  }

  const carouselContent = (
    <div className="relative">
      {/* Carousel Content */}
      <div className="overflow-hidden">
        <motion.div
          key={currentCarouselIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="w-full">
            <div className="p-6 card-bg rounded-2xl glow-border">
              <div className="flex flex-col items-center gap-6">
                {/* Project Icon - Only show for non-JenoAI, non-PMFlow, non-MediScribe, and non-Lumen projects */}
                {featuredProjects[currentCarouselIndex].title !== "JenoAI.com" && featuredProjects[currentCarouselIndex].title !== "PMFlow" && featuredProjects[currentCarouselIndex].title !== "MediScribe" && featuredProjects[currentCarouselIndex].title !== "Lumen" && (
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500 rounded-xl flex items-center justify-center pulse-glow">
                      {(() => {
                        const IconComponent = featuredProjects[currentCarouselIndex].icon;
                        return <IconComponent className="w-8 h-8 text-white" />;
                      })()}
                    </div>
                  </div>
                )}
                
                {/* Interactive Iframe for JenoAI.com, PMFlow, MediScribe, and Lumen */}
                {(featuredProjects[currentCarouselIndex].title === "JenoAI.com" || featuredProjects[currentCarouselIndex].title === "PMFlow" || featuredProjects[currentCarouselIndex].title === "MediScribe" || featuredProjects[currentCarouselIndex].title === "Lumen") && (
                  <div className="w-full mt-4">
                    {/* Iframe at the top */}
                    <div className="bg-white/10 rounded-lg p-2 mb-6 overflow-hidden">
                      <iframe
                        src={featuredProjects[currentCarouselIndex].demo}
                        title={`${featuredProjects[currentCarouselIndex].title} - ${featuredProjects[currentCarouselIndex].summary}`}
                        className="w-full h-[500px] rounded-lg border border-yellow-400/30"
                        frameBorder="0"
                        allowFullScreen
                      />
                    </div>
                    
                    {/* Project details at the bottom */}
                    <div className="text-center">
                      <p className="text-sm text-white/90 mb-4 leading-relaxed">
                        {featuredProjects[currentCarouselIndex].summary}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {featuredProjects[currentCarouselIndex].tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-white/20 text-xs rounded-full text-white border border-yellow-400/30">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-center gap-3 mb-4">
                        {featuredProjects[currentCarouselIndex].demo && (
                          <a
                            href={featuredProjects[currentCarouselIndex].demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-yellow-300 hover:text-yellow-200 transition-colors text-sm"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Demo</span>
                          </a>
                        )}
                        {featuredProjects[currentCarouselIndex].github && (
                          <a
                            href={featuredProjects[currentCarouselIndex].github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-green-300 hover:text-green-200 transition-colors text-sm"
                          >
                            <Github className="w-3 h-3" />
                            <span>Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Carousel Indicators - Only show if multiple projects */}
      {featuredProjects.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {featuredProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCarouselIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCarouselIndex
                  ? 'bg-gradient-to-r from-yellow-400 via-green-400 to-blue-500'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Carousel Navigation - Only show if multiple projects */}
      {featuredProjects.length > 1 && (
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={prevCarousel}
            className="p-2 rounded-full card-bg hover:bg-yellow-400/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={nextCarousel}
            className="p-2 rounded-full card-bg hover:bg-yellow-400/30 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  )

  if (isHero) {
    return carouselContent
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

        {carouselContent}
      </div>
    </section>
  )
}

export default ProjectCarousel 