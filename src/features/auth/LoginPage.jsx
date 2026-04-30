import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from './AuthContext'

const inp = {
  width: '100%',
  background: '#0f1117',
  border: '1px solid #1e2540',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#f0f2f8',
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
}

const label = {
  display: 'block',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#4a5278',
  marginBottom: 8,
  fontFamily: "'JetBrains Mono', monospace",
}

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(null)

  const justRegistered = searchParams.get('registered') === 'true'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) setError(err.message)
    else navigate('/dashboard')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-base)',
      padding: '24px 16px',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52,
            height: 52,
            background: '#22c55e',
            borderRadius: 14,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <svg width="26" height="26" fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#f0f2f8', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Bienvenido
          </h1>
          <p style={{ fontSize: 14, color: '#4a5278' }}>Iniciá sesión en tu cuenta</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#161b27',
          border: '1px solid #1e2540',
          borderRadius: 20,
          padding: '32px 28px',
        }}>
          {justRegistered && (
            <div style={{
              marginBottom: 20,
              padding: '12px 14px',
              background: 'var(--accent-bg)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 10,
              fontSize: 13,
              color: '#22c55e',
            }}>
              ¡Cuenta creada! Revisá tu email para confirmar y luego iniciá sesión.
            </div>
          )}
          {error && (
            <div style={{
              marginBottom: 20,
              padding: '12px 14px',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 10,
              fontSize: 13,
              color: '#f87171',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={label}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
                style={{ ...inp, borderColor: focused === 'email' ? '#22c55e' : '#1e2540' }}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label style={label}>Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
                style={{ ...inp, borderColor: focused === 'password' ? '#22c55e' : '#1e2540' }}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#15803d' : '#22c55e',
                color: '#000',
                border: 'none',
                borderRadius: 10,
                padding: '13px',
                fontSize: 14,
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
                fontFamily: 'inherit',
                marginTop: 4,
              }}
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#4a5278' }}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>
            Registrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
