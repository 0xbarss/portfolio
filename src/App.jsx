import { useState, useEffect, useCallback } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Exploring from './components/Exploring.jsx'
import Stack from './components/Stack.jsx'
import Work from './components/Work.jsx'
import Contact from './components/Contact.jsx'
import ProjectDetail from './components/ProjectDetail.jsx'
import pinned from './data/pinned.json'
import './App.css'

export default function App() {
  const [activeProject, setActiveProject] = useState(null)

  // Sync state with URL hash (e.g. #work/memory-allocator)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash
      if (hash.startsWith('#work/')) {
        const projectName = hash.replace('#work/', '')
        const found = pinned.find((p) => p.name === projectName)
        if (found) {
          setActiveProject(found)
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }
      }
      // If navigating back to main page or a standard section anchor
      if (!hash.startsWith('#work/')) {
        setActiveProject(null)
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const handleSelectProject = useCallback((project) => {
    setActiveProject(project)
    window.location.hash = `#work/${project.name}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleBackToProjects = useCallback(() => {
    setActiveProject(null)
    window.location.hash = '#work'
    setTimeout(() => {
      const el = document.getElementById('work')
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  return (
    <div className="layout">
      <Sidebar activeProject={activeProject} onBack={handleBackToProjects} />
      <main className="main">
        {activeProject ? (
          <ProjectDetail
            project={activeProject}
            onBack={handleBackToProjects}
            onSelectProject={handleSelectProject}
            allProjects={pinned}
          />
        ) : (
          <>
            <Hero />
            <About />
            <Exploring />
            <Stack />
            <Work onSelectProject={handleSelectProject} />
            <Contact />
          </>
        )}
      </main>
    </div>
  )
}
