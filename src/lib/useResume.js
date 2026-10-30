import { useEffect, useState } from 'react'
import personal from '../data/personal.json'

export const resumeHref = `${import.meta.env.BASE_URL}${personal.resume}`

// True only when a real PDF exists, so visitors never get a broken download.
export function useResume() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    let cancelled = false
    fetch(resumeHref, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') || ''
        if (!cancelled) setOk(r.ok && type.includes('pdf'))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])
  return ok
}
