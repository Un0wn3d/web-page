import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import eventsData from '/src/events.json'

const eventsAdapter = createEntityAdapter()

export const fetchEvents = createAsyncThunk('events/fetchAll', async () => {
  await new Promise(res => setTimeout(res, 700))
  return eventsData
})

const eventsSlice = createSlice({
  name: 'events',
  initialState: eventsAdapter.getInitialState({
    status: 'idle',
    error: null,
    searchQuery: '',
    showFavorites: false,
    favorites: (() => {
      try {
        const stored = localStorage.getItem('favoriteEvents')
        return stored ? JSON.parse(stored) : []
      } catch { return [] }
    })(),
  }),
  reducers: {
    setSearchQuery(state, action) { state.searchQuery = action.payload },
    setShowFavorites(state, action) { state.showFavorites = action.payload },
    toggleFavorite(state, action) {
      const id = action.payload
      const idx = state.favorites.indexOf(id)
      if (idx === -1) {
        state.favorites.push(id)
      } else {
        state.favorites.splice(idx, 1)
        if (state.favorites.length === 0) state.showFavorites = false
      }
      try {
        localStorage.setItem('favoriteEvents', JSON.stringify(state.favorites))
      } catch (e) { console.error('localStorage error:', e) }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEvents.pending, state => { state.status = 'loading' })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded'
        eventsAdapter.setAll(state, action.payload)
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  },
})

export const { setSearchQuery, setShowFavorites, toggleFavorite } = eventsSlice.actions
export default eventsSlice.reducer

export const { selectAll: selectAllEvents } = eventsAdapter.getSelectors(s => s.events)

export const selectFilteredEvents = state => {
  const all = selectAllEvents(state)
  const { searchQuery, showFavorites, favorites } = state.events
  return all.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchFav = showFavorites ? favorites.includes(e.id) : true
    return matchSearch && matchFav
  })
}