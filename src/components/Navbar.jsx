import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import MobileMenu from './MobileMenu'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
      isActive
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`

  return (
    <header className="relative bg-white border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 text-base">HábitosApp</span>
        </Link>

        {user && (
          <>
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/gastos" className={linkClass}>Gastos</NavLink>
              <NavLink to="/habitos" className={linkClass}>Hábitos</NavLink>
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs text-gray-400 truncate max-w-[160px]">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-500 hover:text-red-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-red-200 transition-colors"
              >
                Salir
              </button>
            </div>
            <MobileMenu />
          </>
        )}
      </div>
    </header>
  )
}
