import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <Navbar />
      <main className="max-w-5xl mx-auto px-5 py-8">
        <Outlet />
      </main>
    </div>
  )
}
