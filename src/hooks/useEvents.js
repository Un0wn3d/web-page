import { useState, useEffect } from 'react'
import eventsData from '../events.json'

export function useEvents() {
  const [events] = useState(eventsData)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('favoriteEvents')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) setFavorites(parsed)
      }
    } catch (e) {
      console.error('localStorage parse error:', e)
    }
  }, [])

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      try {
        localStorage.setItem('favoriteEvents', JSON.stringify(updated))
      } catch (e) {
        console.error('localStorage write error:', e)
      }
      return updated
    })
  }

  return { events, favorites, toggleFavorite }
}