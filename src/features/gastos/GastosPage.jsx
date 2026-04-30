import { useState } from 'react'
import { useGastos } from './useGastos'
import GastoForm from './GastoForm'
import GastoItem from './GastoItem'

const CATEGORIAS = ['Todas', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Otro']

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

export default function GastosPage() {
  const { gastos, loading, total, crearGasto, actualizarGasto, eliminarGasto } = useGastos()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filtro, setFiltro] = useState('Todas')

  const mes = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()
  const gastosFiltrados = filtro === 'Todas' ? gastos : gastos.filter(g => g.categoria === filtro)

  async function handleCreate(fields) {
    await crearGasto(fields)
    setShowForm(false)
  }

  async function handleUpdate(fields) {
    await actualizarGasto(editing.id, fields)
    setEditing(null)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f0f2f8', letterSpacing: '-0.03em' }}>Gastos</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4a5278', marginTop: 6 }}>{mes}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          style={{
            background: '#22c55e',
            color: '#000',
            border: 'none',
            borderRadius: 10,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'background 0.15s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
          onMouseLeave={e => e.currentTarget.style.background = '#22c55e'}
        >
          + Nuevo gasto
        </button>
      </div>

      {/* Total card */}
      <div style={{
        background: '#161b27',
        border: '1px solid #1e2540',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#4a5278', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Total del mes
          </p>
          <p style={{ fontSize: 36, fontWeight: 800, color: '#f0f2f8', letterSpacing: '-0.03em' }}>
            {formatARS(total)}
          </p>
        </div>
        <div style={{
          width: 44, height: 44,
          background: 'rgba(59,130,246,0.12)',
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" fill="none" stroke="#3b82f6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {/* Form */}
      {(showForm || editing) && (
        <div style={{ marginBottom: 20 }}>
          <GastoForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
        {CATEGORIAS.map(c => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s',
              fontFamily: 'inherit',
              background: filtro === c ? 'var(--accent-bg)' : 'transparent',
              color: filtro === c ? '#22c55e' : '#4a5278',
              border: filtro === c ? '1px solid rgba(34,197,94,0.3)' : '1px solid #1e2540',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{ width: 28, height: 28, border: '3px solid #1e2540', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : gastosFiltrados.length === 0 ? (
        <div style={{ border: '1px dashed #1e2540', borderRadius: 14, padding: '56px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 14 }}>💸</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#4a5278', marginBottom: 4 }}>
            {filtro === 'Todas' ? 'Sin gastos este mes' : `Sin gastos en "${filtro}"`}
          </p>
          <p style={{ fontSize: 12, color: '#3a4060' }}>
            {filtro === 'Todas' ? 'Registrá tu primer gasto usando el botón de arriba' : 'Probá con otro filtro'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#161b27', border: '1px solid #1e2540', borderRadius: 14, overflow: 'hidden' }}>
          {gastosFiltrados.map((g, i) => (
            <div key={g.id} style={i > 0 ? { borderTop: '1px solid #1e2540' } : {}}>
              <GastoItem
                gasto={g}
                onEdit={() => { setEditing(g); setShowForm(false) }}
                onDelete={() => eliminarGasto(g.id)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
