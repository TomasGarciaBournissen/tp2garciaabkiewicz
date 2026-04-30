function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(n)
}

function formatFecha(fecha) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', {
    day: 'numeric', month: 'short'
  })
}

const CATEGORIA_COLORS = {
  Alimentación: 'bg-green-100 text-green-700',
  Transporte: 'bg-blue-100 text-blue-700',
  Entretenimiento: 'bg-purple-100 text-purple-700',
  Salud: 'bg-red-100 text-red-700',
  Educación: 'bg-yellow-100 text-yellow-700',
  Hogar: 'bg-orange-100 text-orange-700',
  Otro: 'bg-gray-100 text-gray-700',
}

export default function GastoItem({ gasto, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORIA_COLORS[gasto.categoria] ?? 'bg-gray-100 text-gray-700'}`}>
              {gasto.categoria}
            </span>
            {gasto.descripcion && (
              <span className="text-sm text-gray-600 truncate">{gasto.descripcion}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{formatFecha(gasto.fecha)}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="font-semibold text-gray-900">{formatARS(gasto.monto)}</span>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
            Editar
          </button>
          <button
            onClick={() => { if (window.confirm('¿Eliminar este gasto?')) onDelete() }}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
