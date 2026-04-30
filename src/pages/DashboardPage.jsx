import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../features/auth/AuthContext'

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    habitosHoy: 0,
    totalHabitos: 0,
    totalMes: 0,
    ultimoGasto: null,
    loading: true,
  })

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

      const totalMes = (gastosMes ?? []).reduce((s, g) => s + Number(g.monto), 0)

      setStats({
        habitosHoy: habitosHoy ?? 0,
        totalHabitos: totalHabitos ?? 0,
        totalMes,
        ultimoGasto: ultimoGastoArr?.[0] ?? null,
        loading: false,
      })
    }
    if (user) fetchStats()
  }, [user])

  if (stats.loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm text-gray-500 font-medium">Hábitos completados hoy</p>
          <p className="text-3xl font-bold text-indigo-600 mt-1">
            {stats.habitosHoy}
            <span className="text-lg text-gray-400 font-normal"> / {stats.totalHabitos}</span>
          </p>
          <Link to="/habitos" className="text-xs text-indigo-500 hover:underline mt-2 inline-block">
            Ver hábitos →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm text-gray-500 font-medium">Gasto total del mes</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{formatARS(stats.totalMes)}</p>
          <Link to="/gastos" className="text-xs text-indigo-500 hover:underline mt-2 inline-block">
            Ver gastos →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <p className="text-sm text-gray-500 font-medium">Último gasto</p>
          {stats.ultimoGasto ? (
            <>
              <p className="text-xl font-bold text-gray-900 mt-1">{formatARS(stats.ultimoGasto.monto)}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {stats.ultimoGasto.categoria}
                {stats.ultimoGasto.descripcion ? ` — ${stats.ultimoGasto.descripcion}` : ''}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400 mt-2">Sin gastos este mes</p>
          )}
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
        <p className="text-sm font-medium text-indigo-700">
          {stats.habitosHoy === stats.totalHabitos && stats.totalHabitos > 0
            ? '¡Completaste todos tus hábitos de hoy!'
            : `Te quedan ${stats.totalHabitos - stats.habitosHoy} hábito${stats.totalHabitos - stats.habitosHoy !== 1 ? 's' : ''} por completar hoy.`}
        </p>
      </div>
    </div>
  )
}
