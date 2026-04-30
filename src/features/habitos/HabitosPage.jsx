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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hábitos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{habitos.length} hábito{habitos.length !== 1 ? 's' : ''} registrado{habitos.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
        >
          + Nuevo hábito
        </button>
      </div>

      {(showForm || editing) && (
        <HabitoForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : habitos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No tenés hábitos todavía</p>
          <p className="text-sm text-gray-400 mt-1">Creá tu primer hábito para empezar a trackear</p>
        </div>
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
