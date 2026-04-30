import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './features/auth/AuthContext'
import PrivateRoute from './routes/PrivateRoute'
import MainLayout from './layouts/MainLayout'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import HabitosPage from './features/habitos/HabitosPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<div className="text-gray-600">Dashboard (próximamente)</div>} />
            <Route path="/gastos" element={<div className="text-gray-600">Gastos (próximamente)</div>} />
            <Route path="/habitos" element={<HabitosPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
