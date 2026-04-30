import { useState } from 'react'
import { useGastos } from './useGastos'
import GastoForm from './GastoForm'
import GastoItem from './GastoItem'

const CATEGORIAS = ['Todas', 'Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Otro']

function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}

export default function GastosPage() {
  const { gastos, loading, total, crearGasto, actualizarGasto, eliminarGasto } = useGastos()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filtro, setFiltro] = useState('Todas')

  const mes = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' })

  const gastosFiltrados = filtro === 'Todas'
    ? gastos
    : gastos.filter(g => g.categoria === filtro)

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gastos</h1>
          <p className="text-sm text-gray-500 mt-0.5 capitalize">{mes}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Nuevo gasto
        </button>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6">
        <p className="text-sm text-indigo-600 font-medium">Total del mes</p>
        <p className="text-3xl font-bold text-indigo-700 mt-1">{formatARS(total)}</p>
      </div>

      {(showForm || editing) && (
        <div className="mb-6">
          <GastoForm
            initial={editing}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-4">
        {CATEGORIAS.map(c => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              filtro === c
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : gastosFiltrados.length === 0 ? (
        <p className="text-center text-gray-500 py-12">
          {filtro === 'Todas' ? 'No tenés gastos registrados este mes.' : `No hay gastos en "${filtro}".`}
        </p>
      ) : (
        <div className="space-y-3">
          {gastosFiltrados.map(g => (
            <GastoItem
              key={g.id}
              gasto={g}
              onEdit={() => { setEditing(g); setShowForm(false) }}
              onDelete={() => eliminarGasto(g.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
