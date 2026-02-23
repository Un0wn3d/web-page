import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: (() => {
      try { return localStorage.getItem('theme') || 'light' } catch { return 'light' }
    })(),
    toasts: [], // { id, message, type: 'success'|'error'|'info' }
  },
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      try { localStorage.setItem('theme', state.theme) } catch {}
    },
    addToast(state, action) {
      state.toasts.push({
        id: Date.now(),
        type: 'info',
        ...action.payload,
      })
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
  },
})

export const { toggleTheme, addToast, removeToast } = uiSlice.actions
export default uiSlice.reducer