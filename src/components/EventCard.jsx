import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toggleFavorite } from '/store/slices/eventsSlice'
import { addToast } from '/store/slices/uiSlice'

function EventCard({ event, isFavorite }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const formattedDate = new Date(event.date).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const handleFavorite = () => {
    dispatch(toggleFavorite(event.id))
    dispatch(addToast({
      type: 'info',
      message: isFavorite ? `«${event.title}» прибрано з цікавих` : `«${event.title}» додано до цікавих`,
    }))
  }

  return (
    <div className={`event-card ${isFavorite ? 'event-card--favorite' : ''}`}>
      <div className="event-card-header">
        <h3 className="event-title">{event.title}</h3>
        <button className={`fav-btn ${isFavorite ? 'fav-btn--active' : ''}`} onClick={handleFavorite}>
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
      <p className="event-desc">{event.description}</p>
      <div className="event-meta">
        <span>📅 {formattedDate}</span>
        <span>🏢 {event.organizer}</span>
      </div>
      <div className="event-actions">
        <button className="btn btn--primary" onClick={() => navigate(`/register/${event.id}`)}>
          Зареєструватись
        </button>
        <button className="btn btn--outline" onClick={() => navigate(`/participants/${event.id}`)}>
          Учасники
        </button>
      </div>
    </div>
  )
}

export default EventCard