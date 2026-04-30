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

  const mes = new Date().toLocaleString('es-AR', { month: 'long', year: 'numeric' })
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gastos</h1>
          <p className="text-sm text-gray-400 mt-0.5 capitalize">{mes}</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditing(null) }}
          className="bg-emerald-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition-colors"
        >
          + Nuevo gasto
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">Total del mes</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{formatARS(total)}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      {(showForm || editing) && (
        <GastoForm
          initial={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
          onCancel={() => { setShowForm(false); setEditing(null) }}
        />
      )}

      <div className="flex gap-2 flex-wrap">
        {CATEGORIAS.map(c => (
          <button
            key={c}
            onClick={() => setFiltro(c)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              filtro === c
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : gastosFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">
            {filtro === 'Todas' ? 'Sin gastos este mes' : `Sin gastos en "${filtro}"`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {gastosFiltrados.map((g, i) => (
            <div key={g.id} className={i > 0 ? 'border-t border-gray-50' : ''}>
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
