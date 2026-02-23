import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-emoji">🍃</span>
        <h2>404 — Сторінку не знайдено</h2>
        <p>Схоже, ця сторінка загубилась у лісі...</p>
        <Link to="/" className="btn btn--primary">← Повернутись на головну</Link>
      </div>
    </div>
  )
}

export default NotFoundPage