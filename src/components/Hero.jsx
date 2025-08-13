import { motion, useScroll, useTransform } from 'framer-motion'
import { Github, Linkedin, Mail, Download, ChevronDown, Rocket } from 'lucide-react'
import ProjectChat from './ProjectChat'
import { featuredProjects } from '../data/projects'

const Hero = () => {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 300], [0, 50])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
        <section className="relative min-h-screen overflow-hidden">
      {/* Floating shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      
      <ProjectChat featuredProjects={featuredProjects} isHero={true} />
    </section>
  )
}

export default Hero 