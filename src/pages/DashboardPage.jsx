import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../features/auth/AuthContext'

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function mesLabel() {
  return new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()
}

const STAT_CARD = {
  background: '#161b27',
  border: '1px solid #1e2540',
  borderRadius: 14,
  padding: '22px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
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

  const progreso = stats.totalHabitos > 0 ? (stats.habitosHoy / stats.totalHabitos) * 100 : 0

  if (stats.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <div style={{
          width: 32, height: 32,
          border: '3px solid #1e2540',
          borderTopColor: '#22c55e',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f0f2f8', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
          Resumen
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4a5278', marginTop: 6 }}>
          {mesLabel()}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>

        {/* Hábitos hoy */}
        <div style={{ ...STAT_CARD, borderTop: '2px solid #22c55e' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#4a5278', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            Hábitos hoy
          </p>
          {stats.totalHabitos === 0 ? (
            <p style={{ fontSize: 28, fontWeight: 700, color: '#3a4060' }}>—</p>
          ) : (
            <>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stats.habitosHoy}
                <span style={{ fontSize: 18, fontWeight: 400, color: '#3a4060' }}> / {stats.totalHabitos}</span>
              </p>
              <div style={{ marginTop: 14, height: 4, background: '#1e2540', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#22c55e', borderRadius: 99, width: `${progreso}%`, transition: 'width 0.4s' }} />
              </div>
            </>
          )}
          <Link to="/habitos" style={{ marginTop: 16, fontSize: 12, color: '#22c55e', textDecoration: 'none', fontWeight: 500 }}>
            Ver hábitos →
          </Link>
        </div>

        {/* Gasto del mes */}
        <div style={{ ...STAT_CARD, borderTop: '2px solid #3b82f6' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#4a5278', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            Gasto del mes
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {formatARS(stats.totalMes)}
          </p>
          <Link to="/gastos" style={{ marginTop: 16, fontSize: 12, color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
            Ver gastos →
          </Link>
        </div>

        {/* Último gasto */}
        <div style={{ ...STAT_CARD, borderTop: '2px solid #f59e0b' }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: '#4a5278', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            Último gasto
          </p>
          {stats.ultimoGasto ? (
            <>
              <p style={{ fontSize: 28, fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {formatARS(stats.ultimoGasto.monto)}
              </p>
              <p style={{ fontSize: 12, color: '#4a5278', marginTop: 8 }}>
                {stats.ultimoGasto.categoria}{stats.ultimoGasto.descripcion ? ` · ${stats.ultimoGasto.descripcion}` : ''}
              </p>
            </>
          ) : (
            <p style={{ fontSize: 28, fontWeight: 700, color: '#3a4060' }}>—</p>
          )}
        </div>
      </div>

      {/* Empty state si no hay datos */}
      {stats.totalHabitos === 0 && stats.totalMes === 0 && (
        <div style={{
          border: '1px dashed #1e2540',
          borderRadius: 14,
          padding: '48px 32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, opacity: 0.2, marginBottom: 16 }}>📊</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#4a5278', marginBottom: 6 }}>
            Tu dashboard está vacío
          </p>
          <p style={{ fontSize: 13, color: '#3a4060' }}>
            Creá tus primeros hábitos y gastos para ver el resumen acá
          </p>
        </div>
      )}

      {/* Motivacional */}
      {stats.totalHabitos > 0 && (
        <div style={{
          marginTop: 8,
          background: progreso === 100 ? 'var(--accent-bg)' : '#161b27',
          border: `1px solid ${progreso === 100 ? 'rgba(34,197,94,0.3)' : '#1e2540'}`,
          borderRadius: 14,
          padding: '16px 20px',
        }}>
          <p style={{ fontSize: 14, color: progreso === 100 ? '#22c55e' : '#4a5278' }}>
            {progreso === 100
              ? '¡Completaste todos tus hábitos de hoy!'
              : `Te quedan ${stats.totalHabitos - stats.habitosHoy} hábito${stats.totalHabitos - stats.habitosHoy !== 1 ? 's' : ''} por completar hoy.`}
          </p>
        </div>
      )}
    </div>
  )
}
