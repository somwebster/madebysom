import Hero from './components/Hero'
import BeliefsAndCapabilities from './components/BeliefsAndCapabilities'
import ProjectShowcase from './components/ProjectShowcase'
import MyStory from './components/MyStory'
import Contact from './components/Contact'
import { projects } from './data/projects'
import { beliefs, capabilities } from './data/content'

function App() {
  return (
    <div className="min-h-screen">
      <Hero />
      <BeliefsAndCapabilities beliefs={beliefs} capabilities={capabilities} />
      <ProjectShowcase projects={projects} />
      <MyStory />
      <Contact />
    </div>
  )
}

export default App
