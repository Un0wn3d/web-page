import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EventList from '../components/EventList'
import {
  fetchEvents,
  setSearchQuery,
  setShowFavorites,
  selectFilteredEvents,
} from '../../store/slices/eventsSlice'

const PAGE_SIZE = 8

function HomePage() {
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)

  const status = useSelector(s => s.events.status)
  const error = useSelector(s => s.events.error)
  const searchQuery = useSelector(s => s.events.searchQuery)
  const showFavorites = useSelector(s => s.events.showFavorites)
  const favorites = useSelector(s => s.events.favorites)
  const filteredEvents = useSelector(selectFilteredEvents)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchEvents())
  }, [status, dispatch])

  const paginated = filteredEvents.slice(0, page * PAGE_SIZE)
  const hasMore = paginated.length < filteredEvents.length

  const handleSearch = (val) => {
    dispatch(setSearchQuery(val))
    setPage(1)
  }

  return (
    <div className="home-page">
      <div className="page-hero">
        <h2 className="page-hero-title">Еко-події України</h2>
        <p className="page-hero-sub">Долучайтесь до прибирань — разом ми зробимо країну чистішою</p>
      </div>

      <div className="filters-bar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Пошук за назвою..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => handleSearch('')}>✕</button>
          )}
        </div>
        {favorites.length > 0 && (
          <button
            className={`fav-filter-btn ${showFavorites ? 'fav-filter-btn--active' : ''}`}
            onClick={() => dispatch(setShowFavorites(!showFavorites))}
          >
            ★ {favorites.length} цікавих
          </button>
        )}
        <span className="results-count">{filteredEvents.length} подій</span>
      </div>

      <EventList events={paginated} favorites={favorites} status={status} error={error} />

      {status === 'succeeded' && hasMore && (
        <div className="load-more-wrapper">
          <button className="btn btn--load-more" onClick={() => setPage(p => p + 1)}>
            Завантажити ще ({filteredEvents.length - paginated.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage