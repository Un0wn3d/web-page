import { useDispatch, useSelector } from 'react-redux'
import { removeToast } from '/store/slices/uiSlice'
import { useEffect } from 'react'

function Toast({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 4000)
    return () => clearTimeout(timer)
  }, [toast.id, dispatch])

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast-icon">
        {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
      </span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close" onClick={() => dispatch(removeToast(toast.id))}>✕</button>
    </div>
  )
}

function ToastContainer() {
  const toasts = useSelector(s => s.ui.toasts)
  return (
    <div className="toast-container">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  )
}

export default ToastContainer