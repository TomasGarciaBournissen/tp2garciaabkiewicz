import { useState } from 'react'
import { useHabitos } from './useHabitos'
import { useHabitosLog } from './useHabitosLog'
import HabitoForm from './HabitoForm'
import HabitoCard from './HabitoCard'

export default function HabitosPage() {
  const { habitos, loading, crearHabito, actualizarHabito, eliminarHabito } = useHabitos()
  const { logHoy, toggleCompletado } = useHabitosLog()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  async function handleCreate(fields) {
    await crearHabito(fields)
    setShowForm(false)
  }

  async function handleUpdate(fields) {
    await actualizarHabito(editing.id, fields)
    setEditing(null)
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#f0f2f8', letterSpacing: '-0.03em' }}>Hábitos</h1>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#4a5278', marginTop: 6 }}>
            {habitos.length} HÁBITO{habitos.length !== 1 ? 'S' : ''} REGISTRADO{habitos.length !== 1 ? 'S' : ''}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          style={{
            background: '#22c55e', color: '#000', border: 'none', borderRadius: 10,
            padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            transition: 'background 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#16a34a'}
          onMouseLeave={e => e.currentTarget.style.background = '#22c55e'}
        >
          + Nuevo hábito
        </button>
      </div>

      {(showForm || editing) && (
        <div style={{ marginBottom: 20 }}>
          <HabitoForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0' }}>
          <div style={{ width: 28, height: 28, border: '3px solid #1e2540', borderTopColor: '#22c55e', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : habitos.length === 0 ? (
        <div style={{ border: '1px dashed #1e2540', borderRadius: 14, padding: '56px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, opacity: 0.2, marginBottom: 14 }}>✓</div>
          <p style={{ fontSize: 14, fontWeight: 600, color: '#4a5278', marginBottom: 4 }}>No tenés hábitos todavía</p>
          <p style={{ fontSize: 12, color: '#3a4060' }}>Creá tu primer hábito para empezar a trackear</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
          {habitos.map(h => (
            <HabitoCard
              key={h.id}
              habito={h}
              completadoHoy={logHoy.includes(h.id)}
              onToggle={() => toggleCompletado(h.id)}
              onEdit={() => { setEditing(h); setShowForm(false) }}
              onDelete={() => eliminarHabito(h.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
