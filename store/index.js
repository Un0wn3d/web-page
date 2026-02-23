import { configureStore } from '@reduxjs/toolkit'
import eventsReducer from './slices/eventsSlice'
import participantsReducer from './slices/participantsSlice'
import uiReducer from './slices/uiSlice'
import analyticsReducer from './slices/analyticsSlice'

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    participants: participantsReducer,
    ui: uiReducer,
    analytics: analyticsReducer,
  },
})