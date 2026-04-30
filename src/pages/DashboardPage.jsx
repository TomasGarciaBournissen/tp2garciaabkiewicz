import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../features/auth/AuthContext'

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ habitosHoy: 0, totalHabitos: 0, totalMes: 0, ultimoGasto: null, loading: true })

  useEffect(() => {
    async function fetchStats() {
      const hoy = new Date().toISOString().slice(0, 10)
      const mes = hoy.slice(0, 7)
      const [{ count: totalHabitos }, { count: habitosHoy }, { data: gastosMes }, { data: ultimoGastoArr }] =
        await Promise.all([
          supabase.from('habitos').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('habitos_log').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('fecha', hoy),
          supabase.from('gastos').select('monto').eq('user_id', user.id).gte('fecha', `${mes}-01`).lte('fecha', `${mes}-31`),
          supabase.from('gastos').select('monto,categoria,descripcion,fecha').eq('user_id', user.id).order('fecha', { ascending: false }).limit(1),
        ])
      setStats({
        habitosHoy: habitosHoy ?? 0,
        totalHabitos: totalHabitos ?? 0,
        totalMes: (gastosMes ?? []).reduce((s, g) => s + Number(g.monto), 0),
        ultimoGasto: ultimoGastoArr?.[0] ?? null,
        loading: false,
      })
    }
    if (user) fetchStats()
  }, [user])

  const mes = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' })
  const progreso = stats.totalHabitos > 0 ? (stats.habitosHoy / stats.totalHabitos) * 100 : 0

  if (stats.loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resumen</h1>
        <p className="text-sm text-gray-400 mt-0.5 capitalize">{mes}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Hábitos hoy</p>
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {stats.habitosHoy}
            <span className="text-lg text-gray-300 font-normal"> / {stats.totalHabitos}</span>
          </p>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progreso}%` }} />
          </div>
          <Link to="/habitos" className="text-xs text-emerald-600 font-medium hover:underline mt-3 inline-block">
            Ver hábitos →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Gasto del mes</p>
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatARS(stats.totalMes)}</p>
          <Link to="/gastos" className="text-xs text-blue-600 font-medium hover:underline mt-3 inline-block">
            Ver gastos →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500">Último gasto</p>
            <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          {stats.ultimoGasto ? (
            <>
              <p className="text-3xl font-bold text-gray-900">{formatARS(stats.ultimoGasto.monto)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.ultimoGasto.categoria}{stats.ultimoGasto.descripcion ? ` · ${stats.ultimoGasto.descripcion}` : ''}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-gray-300">—</p>
          )}
        </div>
      </div>

      {stats.totalHabitos > 0 && (
        <div className={`rounded-2xl p-5 ${progreso === 100 ? 'bg-emerald-500' : 'bg-white border border-gray-100 shadow-sm'}`}>
          <p className={`text-sm font-medium ${progreso === 100 ? 'text-white' : 'text-gray-700'}`}>
            {progreso === 100
              ? '¡Completaste todos tus hábitos de hoy! 🎉'
              : `Te quedan ${stats.totalHabitos - stats.habitosHoy} hábito${stats.totalHabitos - stats.habitosHoy !== 1 ? 's' : ''} por completar hoy.`}
          </p>
        </div>
      )}
    </div>
  )
}
