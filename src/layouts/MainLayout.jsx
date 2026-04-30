import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Sidebar />
      <main className="flex-1 min-w-0" style={{ display: 'flex', justifyContent: 'center', padding: '52px 40px' }}>
        <div style={{ width: '100%', maxWidth: 860 }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
