import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllEvents } from '/store/slices/eventsSlice'
import { addToast } from '/store/slices/uiSlice'
import { registerSchema } from '../schemas/registerSchema'

const SOURCE_OPTIONS = [
  { value: '', label: 'Оберіть джерело...' },
  { value: 'social', label: 'Соціальні мережі' },
  { value: 'friends', label: 'Від друзів / знайомих' },
  { value: 'website', label: 'Вебсайт організатора' },
  { value: 'email', label: 'Email-розсилка' },
  { value: 'other', label: 'Інше' },
]

function RegisterPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const events = useSelector(selectAllEvents)
  const event = events.find(e => e.id === Number(eventId))

  const [form, setForm] = useState({ fullName: '', email: '', birthDate: '', source: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  if (!event) {
    return (
      <div className="not-found-page">
        <h2>Подію не знайдено</h2>
        <Link to="/" className="btn btn--primary">← Повернутись</Link>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = registerSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors = {}
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    setStatus('loading')
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, eventId }),
      })
      if (!response.ok) throw new Error('Server error')
      setStatus('success')
      dispatch(addToast({ type: 'success', message: `Ви зареєструвались на «${event.title}»!` }))
      setTimeout(() => navigate(`/participants/${event.id}`), 1500)
    } catch (err) {
      setStatus('error')
      dispatch(addToast({ type: 'error', message: 'Помилка реєстрації. Спробуйте ще раз.' }))
    }
  }

  const formattedDate = new Date(event.date).toLocaleDateString('uk-UA', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  if (status === 'success') {
    return (
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">✅</div>
          <h2>Реєстрацію підтверджено!</h2>
          <p>Перенаправляємо на список учасників...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="register-page">
      <div className="register-layout">
        <aside className="event-info-card">
          <div className="event-info-label">Ви реєструєтесь на</div>
          <h2 className="event-info-title">{event.title}</h2>
          <div className="event-info-meta">
            <div className="event-info-row"><span>📅</span><span>{formattedDate}</span></div>
            <div className="event-info-row"><span>🏢</span><span>{event.organizer}</span></div>
          </div>
          <p className="event-info-desc">{event.description}</p>
          <Link to="/" className="back-link">← Назад до подій</Link>
        </aside>

        <div className="register-form-wrapper">
          <h3 className="form-title">Форма реєстрації</h3>
          <form onSubmit={handleSubmit} className="register-form" noValidate>

            <div className={`form-field ${errors.fullName ? 'form-field--error' : ''}`}>
              <label className="form-label" htmlFor="fullName">ПІБ *</label>
              <input id="fullName" name="fullName" type="text" className="form-input"
                placeholder="Іваненко Іван Іванович" value={form.fullName} onChange={handleChange} />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className={`form-field ${errors.email ? 'form-field--error' : ''}`}>
              <label className="form-label" htmlFor="email">Email *</label>
              <input id="email" name="email" type="email" className="form-input"
                placeholder="example@email.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className={`form-field ${errors.birthDate ? 'form-field--error' : ''}`}>
              <label className="form-label" htmlFor="birthDate">Дата народження *</label>
              <input id="birthDate" name="birthDate" type="date" className="form-input"
                value={form.birthDate} onChange={handleChange}
                max={new Date().toISOString().split('T')[0]} />
              {errors.birthDate && <span className="form-error">{errors.birthDate}</span>}
            </div>

            <div className={`form-field ${errors.source ? 'form-field--error' : ''}`}>
              <label className="form-label" htmlFor="source">Звідки дізнались? *</label>
              <select id="source" name="source" className="form-input form-select"
                value={form.source} onChange={handleChange}>
                {SOURCE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
                ))}
              </select>
              {errors.source && <span className="form-error">{errors.source}</span>}
            </div>

            {status === 'error' && (
              <div className="form-server-error">Помилка сервера. Спробуйте ще раз.</div>
            )}

            <button type="submit" className="btn btn--primary btn--full" disabled={status === 'loading'}>
              {status === 'loading' ? 'Відправляємо...' : 'Зареєструватись →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage