import Sidebar from './components/Sidebar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Exploring from './components/Exploring.jsx'
import Stack from './components/Stack.jsx'
import Work from './components/Work.jsx'
import Contact from './components/Contact.jsx'
import './App.css'

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <Hero />
        <About />
        <Exploring />
        <Stack />
        <Work />
        <Contact />
      </main>
    </div>
  )
}
