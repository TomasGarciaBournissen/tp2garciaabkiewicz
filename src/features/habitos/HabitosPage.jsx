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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Mis hábitos</h1>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Nuevo hábito
        </button>
      </div>

      {(showForm || editing) && (
        <div className="mb-6">
          <HabitoForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : habitos.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No tenés hábitos registrados todavía.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
