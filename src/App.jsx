import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import RegisterPage from './pages/RegisterPage'
import ParticipantsPage from './pages/ParticipantsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import NotFoundPage from './pages/NotFoundPage'
import ToastContainer from './components/ToastContainer'
import './analytics.css'

function App() {
  const theme = useSelector(s => s.ui.theme)

  useEffect(() => {
    document.body.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/register/:eventId" element={<RegisterPage />} />
          <Route path="/participants/:eventId" element={<ParticipantsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App