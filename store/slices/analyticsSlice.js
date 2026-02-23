import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

function generateRegistrationData(events) {
  const data = {}
  const now = new Date()
  events.forEach(event => {
    const count = Math.floor(Math.random() * 15) + 3
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 30)
      const date = new Date(now)
      date.setDate(date.getDate() - daysAgo)
      const key = date.toISOString().split('T')[0]
      data[key] = (data[key] || 0) + 1
    }
  })
  return Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      count,
      label: new Date(date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
    }))
}

function generateSourceData(events) {
  const sources = ['social', 'friends', 'website', 'email', 'other']
  const labels = { social: 'Соцмережі', friends: 'Від друзів', website: 'Вебсайт', email: 'Email', other: 'Інше' }
  const counts = { social: 0, friends: 0, website: 0, email: 0, other: 0 }
  events.forEach((_, i) => {
    const s = sources[i % sources.length]
    counts[s] += Math.floor(Math.random() * 8) + 2
  })
  return Object.entries(counts).map(([key, value]) => ({ name: labels[key], value, key }))
}

function generateMonthlyData(events) {
  const months = {}
  events.forEach(event => {
    const date = new Date(event.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('uk-UA', { month: 'short', year: 'numeric' })
    if (!months[key]) months[key] = { key, label, events: 0, registrations: 0 }
    months[key].events++
    months[key].registrations += Math.floor(Math.random() * 20) + 5
  })
  return Object.values(months).sort((a, b) => a.key.localeCompare(b.key))
}

export const fetchExternalEvents = createAsyncThunk(
  'analytics/fetchExternal',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      if (!res.ok) throw new Error('API недоступний')
      const posts = await res.json()
      return posts.map((p, i) => ({
        id: 1000 + i,
        title: p.title.length > 50 ? p.title.slice(0, 50) + '...' : p.title,
        description: p.body.slice(0, 120) + '...',
        organizer: 'Зовнішнє джерело',
        date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        external: true,
      }))
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    registrationData: [],
    sourceData: [],
    monthlyData: [],
    externalEvents: [],
    externalStatus: 'idle',
    externalError: null,
    totalRegistrations: 0,
    activeEvents: 0,
    avgPerDay: 0,
    peakDay: null,
  },
  reducers: {
    computeAnalytics(state, action) {
      const { events } = action.payload
      const regData = generateRegistrationData(events)
      state.registrationData = regData
      state.sourceData = generateSourceData(events)
      state.monthlyData = generateMonthlyData(events)
      state.totalRegistrations = regData.reduce((s, d) => s + d.count, 0)
      state.activeEvents = events.filter(e => new Date(e.date) >= new Date()).length
      state.avgPerDay = regData.length ? Math.round(state.totalRegistrations / regData.length) : 0
      state.peakDay = regData.reduce((m, d) => d.count > (m?.count ?? 0) ? d : m, null)
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchExternalEvents.pending, state => { state.externalStatus = 'loading'; state.externalError = null })
      .addCase(fetchExternalEvents.fulfilled, (state, action) => { state.externalStatus = 'succeeded'; state.externalEvents = action.payload })
      .addCase(fetchExternalEvents.rejected, (state, action) => { state.externalStatus = 'failed'; state.externalError = action.payload })
  },
})

export const { computeAnalytics } = analyticsSlice.actions
export default analyticsSlice.reducer