import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <main className="flex-1 min-w-0 p-8 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}
