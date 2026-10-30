import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ui } from './ui.js'
import personal from '../data/personal.json'

const Ctx = createContext(null)

function detect() {
  try {
    const saved = localStorage.getItem('lang')
    if (saved === 'en' || saved === 'tr') return saved
  } catch {
    // storage unavailable
  }
  return (navigator.language || '').toLowerCase().startsWith('tr') ? 'tr' : 'en'
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detect)
  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem('lang', next)
    } catch {
      // storage unavailable
    }
  }, [])

  // l(): pick the current language from an { en, tr } pair (plain values pass through)
  const l = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.en ?? '' : v)
  const t = (key) => ui[lang][key] ?? ui.en[key] ?? key

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = l(personal.site.title)
  }, [lang]) // eslint-disable-line react-hooks/exhaustive-deps

  return <Ctx.Provider value={{ lang, setLang, t, l }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
