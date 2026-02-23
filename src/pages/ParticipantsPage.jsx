import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchParticipants,
  setParticipantsSearch,
  loadMore,
  resetParticipants,
  selectFilteredParticipants,
  selectVisibleParticipants,
} from '/store/slices/participantsSlice'
import { selectAllEvents } from '/store/slices/eventsSlice'

const SOURCE_LABELS = {
  social: 'Соцмережі', friends: 'Від друзів',
  website: 'Вебсайт', email: 'Email', other: 'Інше',
}

function ParticipantSkeleton() {
  return (
    <tr className="participants-row">
      {Array.from({ length: 5 }).map((_, i) => (
        <td key={i}><div className="skeleton skeleton--row" /></td>
      ))}
    </tr>
  )
}

function ParticipantsPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const events = useSelector(selectAllEvents)
  const event = events.find(e => e.id === Number(eventId))

  const status = useSelector(s => s.participants.status)
  const error = useSelector(s => s.participants.error)
  const searchQuery = useSelector(s => s.participants.searchQuery)
  const visibleCount = useSelector(s => s.participants.visibleCount)
  const filtered = useSelector(selectFilteredParticipants)
  const visible = useSelector(selectVisibleParticipants)
  const hasMore = visible.length < filtered.length

  useEffect(() => {
    dispatch(fetchParticipants(Number(eventId)))
    return () => dispatch(resetParticipants())
  }, [eventId, dispatch])

  const formattedDate = event
    ? new Date(event.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="participants-page">
      <div className="participants-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Усі події</button>
        <div className="participants-event-info">
          <h2 className="participants-title">{event?.title ?? `Подія #${eventId}`}</h2>
          <div className="participants-meta">
            {event && <><span>📅 {formattedDate}</span><span>🏢 {event.organizer}</span></>}
            {status === 'succeeded' && (
              <span className="badge-count">👥 {filtered.length} учасників</span>
            )}
          </div>
        </div>
        <button className="btn btn--primary" onClick={() => navigate(`/register/${eventId}`)}>
          + Зареєструватись
        </button>
      </div>

      {/* Search */}
      <div className="participants-search">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Пошук за ім'ям або email..."
            value={searchQuery}
            onChange={e => dispatch(setParticipantsSearch(e.target.value))}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => dispatch(setParticipantsSearch(''))}>✕</button>
          )}
        </div>
      </div>

      {status === 'failed' && (
        <div className="error-state">
          <span>⚠️</span>
          <p>Помилка завантаження: {error}</p>
          <button className="btn btn--primary" onClick={() => dispatch(fetchParticipants(Number(eventId)))}>
            Спробувати знову
          </button>
        </div>
      )}

      {status !== 'failed' && (
        <div className="participants-table-wrapper">
          <table className="participants-table">
            <thead>
              <tr>
                <th>#</th><th>ПІБ</th><th>Email</th><th>Джерело</th><th>Дата реєстрації</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading'
                ? Array.from({ length: 8 }).map((_, i) => <ParticipantSkeleton key={i} />)
                : visible.map((p, i) => (
                  <tr key={p.id} className="participants-row">
                    <td className="row-num">{i + 1}</td>
                    <td className="row-name">
                      <span className="avatar">{p.name.charAt(0)}</span>{p.name}
                    </td>
                    <td className="row-email">{p.email}</td>
                    <td><span className="source-badge">{SOURCE_LABELS[p.source]}</span></td>
                    <td className="row-date">{p.registeredAt}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}

      {status === 'succeeded' && hasMore && (
        <div className="load-more-wrapper">
          <button className="btn btn--load-more" onClick={() => dispatch(loadMore())}>
            Завантажити ще ({filtered.length - visibleCount})
          </button>
        </div>
      )}
    </div>
  )
}

export default ParticipantsPage