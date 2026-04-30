import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117' }}>
        <div style={{
          width: 32,
          height: 32,
          border: '3px solid #1e2540',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
