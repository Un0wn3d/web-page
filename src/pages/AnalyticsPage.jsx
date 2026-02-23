import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, LineChart, Line,
} from 'recharts'
import { computeAnalytics, fetchExternalEvents } from '/store/slices/analyticsSlice'
import { selectAllEvents } from '/store/slices/eventsSlice'
import { addToast } from '/store/slices/uiSlice'

const COLORS = ['#2d7a4f', '#4caf7d', '#f4a234', '#7b5ea7', '#e05c5c']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  )
}

function AnalyticsPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const events = useSelector(selectAllEvents)
  const eventsStatus = useSelector(s => s.events.status)
  const {
    registrationData, sourceData, monthlyData,
    externalEvents, externalStatus, externalError,
    totalRegistrations, activeEvents, avgPerDay, peakDay,
  } = useSelector(s => s.analytics)

  useEffect(() => {
    if (eventsStatus === 'succeeded' && registrationData.length === 0) {
      dispatch(computeAnalytics({ events }))
    }
  }, [eventsStatus, events, dispatch, registrationData.length])

  const handleImport = () => {
    dispatch(fetchExternalEvents()).then(action => {
      if (action.meta.requestStatus === 'fulfilled') {
        dispatch(addToast({ type: 'success', message: `Імпортовано ${action.payload.length} зовнішніх подій` }))
      } else {
        dispatch(addToast({ type: 'error', message: 'Помилка імпорту даних' }))
      }
    })
  }

  const isLoading = eventsStatus === 'loading' || registrationData.length === 0

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">Аналітика</h2>
          <p className="analytics-sub">Статистика реєстрацій та активності подій</p>
        </div>
        <div className="analytics-actions">
          <button className="btn btn--outline" onClick={() => navigate('/')}>← Головна</button>
          <button
            className="btn btn--primary"
            onClick={handleImport}
            disabled={externalStatus === 'loading'}
          >
            {externalStatus === 'loading' ? '⏳ Імпорт...' : '🌐 Імпорт з API'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard icon="📋" label="Усього реєстрацій" value={isLoading ? '—' : totalRegistrations} color="#2d7a4f" />
        <StatCard icon="📅" label="Активних подій" value={isLoading ? '—' : activeEvents} sub="заплановано" color="#f4a234" />
        <StatCard icon="📈" label="Середньо на день" value={isLoading ? '—' : avgPerDay} sub="реєстрацій" color="#7b5ea7" />
        <StatCard
          icon="🏆"
          label="Пік активності"
          value={isLoading || !peakDay ? '—' : peakDay.count}
          sub={peakDay ? peakDay.label : ''}
          color="#e05c5c"
        />
      </div>

      {isLoading ? (
        <div className="charts-skeleton">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="chart-card">
              <div className="skeleton skeleton--chart-title" />
              <div className="skeleton skeleton--chart" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Area Chart — Registration Activity */}
          <div className="chart-card chart-card--wide">
            <h3 className="chart-title">📊 Активність реєстрацій (останні 30 днів)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={registrationData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d7a4f" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2d7a4f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-light)' }} interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-light)' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="count" name="Реєстрації"
                  stroke="#2d7a4f" strokeWidth={2.5}
                  fill="url(#colorCount)" dot={false} activeDot={{ r: 5, fill: '#2d7a4f' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="charts-row">
            {/* Bar Chart — Monthly */}
            <div className="chart-card">
              <h3 className="chart-title">📅 Реєстрації по місяцях</h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-light)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-light)' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="registrations" name="Реєстрації" fill="#4caf7d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="events" name="Подій" fill="#f4a234" radius={[4, 4, 0, 0]} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart — Sources */}
            <div className="chart-card">
              <h3 className="chart-title">🔍 Джерела реєстрацій</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={sourceData} cx="50%" cy="50%"
                    innerRadius={55} outerRadius={90}
                    paddingAngle={3} dataKey="value" nameKey="name"
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart — Events per month */}
          <div className="chart-card chart-card--wide">
            <h3 className="chart-title">📈 Кількість подій по місяцях</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--text-light)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-light)' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone" dataKey="events" name="Подій"
                  stroke="#7b5ea7" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#7b5ea7' }} activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* External Events Import Result */}
      {externalEvents.length > 0 && (
        <div className="external-events">
          <h3 className="chart-title">🌐 Імпортовані зовнішні події ({externalEvents.length})</h3>
          <div className="external-grid">
            {externalEvents.map(e => (
              <div key={e.id} className="external-card">
                <div className="external-badge">Зовнішнє</div>
                <h4 className="external-title">{e.title}</h4>
                <p className="external-desc">{e.description}</p>
                <div className="external-meta">
                  <span>📅 {new Date(e.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}</span>
                  <span>🏢 {e.organizer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {externalError && (
        <div className="error-state">
          <span>⚠️</span>
          <p>Помилка імпорту: {externalError}</p>
        </div>
      )}
    </div>
  )
}

export default AnalyticsPage