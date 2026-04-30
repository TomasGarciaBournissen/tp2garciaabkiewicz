import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

const NAV = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: '/gastos',
    label: 'Gastos',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: '/habitos',
    label: 'Hábitos',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <aside
      style={{
        width: 200,
        minWidth: 200,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            background: 'var(--accent)',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="18" height="18" fill="none" stroke="#000" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            HábitosApp
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.15s',
              background: isActive ? 'var(--accent-bg)' : 'transparent',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              border: isActive ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
            })}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: email + logout */}
      <div style={{ padding: '20px 12px 0', borderTop: '1px solid var(--border)', marginTop: 8 }}>
        {user && (
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: 'var(--text-muted)',
            marginBottom: 12,
            padding: '0 4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {user.email}
          </p>
        )}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s',
            textAlign: 'left',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.background = 'rgba(239,68,68,0.06)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent' }}
        >
          Salir
        </button>
      </div>
    </aside>
  )
}
