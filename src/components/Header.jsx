function Header({ searchQuery, onSearchChange, favoritesCount, showFavorites, onToggleShowFavorites }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <span className="header-icon">🌿</span>
          <div>
            <h1 className="header-title">EcoToloka</h1>
            <p className="header-subtitle">Clean-up Events Across Ukraine</p>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Пошук за назвою події..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => onSearchChange('')}>✕</button>
            )}
          </div>
          {favoritesCount > 0 && (
            <button
              className={`favorites-badge ${showFavorites ? 'favorites-badge--active' : ''}`}
              onClick={onToggleShowFavorites}
              title={showFavorites ? 'Показати всі події' : 'Показати тільки цікаві'}
            >
              <span>★</span> {favoritesCount} цікавих
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header