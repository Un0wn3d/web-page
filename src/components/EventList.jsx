import EventCard from './EventCard'

function SkeletonCard() {
  return (
    <div className="event-card skeleton-card">
      <div className="skeleton skeleton--title" />
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--text skeleton--short" />
      <div className="skeleton skeleton--meta" />
      <div className="skeleton skeleton--actions" />
    </div>
  )
}

function EventList({ events, favorites, status, error }) {
  if (status === 'loading') {
    return (
      <div className="events-grid">
        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="error-state">
        <span>⚠️</span>
        <p>Помилка завантаження: {error}</p>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="empty-state">
        <span>🌱</span>
        <p>Жодних подій не знайдено</p>
      </div>
    )
  }

  return (
    <div className="events-grid">
      {events.map(event => (
        <EventCard key={event.id} event={event} isFavorite={favorites.includes(event.id)} />
      ))}
    </div>
  )
}

export default EventList