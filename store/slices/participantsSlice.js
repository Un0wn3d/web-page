import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'

const participantsAdapter = createEntityAdapter()

const NAMES = [
  'Олена Коваль','Дмитро Шевченко','Марія Бондаренко','Андрій Мельник',
  'Наталія Іваненко','Сергій Кравченко','Тетяна Романова','Олексій Савченко',
  'Вікторія Лисенко','Михайло Кузьменко','Ірина Павленко','Роман Тимченко',
  'Людмила Захаренко','Василь Черненко','Оксана Марченко','Петро Гнатенко',
  'Христина Данченко','Іван Руденко','Юлія Власенко','Тарас Яременко',
  'Аліна Петренко','Богдан Михайленко','Катерина Стець','Артем Олійник',
]
const SOURCES = ['social','friends','website','email','other']

function generateParticipants(eventId) {
  return Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    email: `user${eventId * 100 + i}@eco.ua`,
    source: SOURCES[i % SOURCES.length],
    registeredAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' }),
  }))
}

export const fetchParticipants = createAsyncThunk(
  'participants/fetchByEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      await new Promise(res => setTimeout(res, 800))
      return { eventId, participants: generateParticipants(eventId) }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const participantsSlice = createSlice({
  name: 'participants',
  initialState: participantsAdapter.getInitialState({
    status: 'idle',
    error: null,
    currentEventId: null,
    searchQuery: '',
    visibleCount: 8,
  }),
  reducers: {
    setParticipantsSearch(state, action) { state.searchQuery = action.payload },
    loadMore(state) { state.visibleCount += 8 },
    resetParticipants(state) {
      participantsAdapter.removeAll(state)
      state.status = 'idle'
      state.error = null
      state.searchQuery = ''
      state.visibleCount = 8
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchParticipants.pending, state => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.currentEventId = action.payload.eventId
        state.visibleCount = 8
        participantsAdapter.setAll(state, action.payload.participants)
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const { setParticipantsSearch, loadMore, resetParticipants } = participantsSlice.actions
export default participantsSlice.reducer

export const { selectAll: selectAllParticipants } = participantsAdapter.getSelectors(s => s.participants)

export const selectFilteredParticipants = state => {
  const all = selectAllParticipants(state)
  const q = state.participants.searchQuery.toLowerCase()
  if (!q) return all
  
  return all.filter(p =>
    p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)
  )
}

export const selectVisibleParticipants = state => {
  const filtered = selectFilteredParticipants(state)
  return filtered.slice(0, state.participants.visibleCount)
}