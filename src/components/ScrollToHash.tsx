import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export default function ScrollToHash() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const id = hash.startsWith("#") ? hash.slice(1) : hash

    // Wait a tick to ensure target exists in DOM
    const handle = window.requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        // Optional focus for accessibility
        ;(el as HTMLElement).tabIndex = -1
        ;(el as HTMLElement).focus({ preventScroll: true })
      }
    })

    return () => window.cancelAnimationFrame(handle)
  }, [hash])

  return null
}

