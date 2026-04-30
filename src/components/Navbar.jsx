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
    `text-sm font-medium transition-colors ${
      isActive ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
    }`

  return (
    <header className="relative bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-semibold text-gray-900 text-base">
          HábitosApp
        </Link>

        {user && (
          <>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/gastos" className={linkClass}>Gastos</NavLink>
              <NavLink to="/habitos" className={linkClass}>Hábitos</NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                Salir
              </button>
            </nav>
            <MobileMenu />
          </>
        )}
      </div>
    </header>
  )
}
