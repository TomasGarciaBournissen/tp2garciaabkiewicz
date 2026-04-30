function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function formatFecha(fecha) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

const CATEGORIA_ICONS = {
  Alimentación: { bg: 'bg-green-100', text: 'text-green-600' },
  Transporte: { bg: 'bg-blue-100', text: 'text-blue-600' },
  Entretenimiento: { bg: 'bg-purple-100', text: 'text-purple-600' },
  Salud: { bg: 'bg-red-100', text: 'text-red-600' },
  Educación: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  Hogar: { bg: 'bg-orange-100', text: 'text-orange-600' },
  Otro: { bg: 'bg-gray-100', text: 'text-gray-500' },
}

export default function GastoItem({ gasto, onEdit, onDelete }) {
  const color = CATEGORIA_ICONS[gasto.categoria] ?? CATEGORIA_ICONS.Otro

  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${color.bg}`}>
          <span className={`text-xs font-bold ${color.text}`}>{gasto.categoria[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {gasto.descripcion || gasto.categoria}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {gasto.descripcion ? gasto.categoria + ' · ' : ''}{formatFecha(gasto.fecha)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <span className="font-semibold text-gray-900">{formatARS(gasto.monto)}</span>
        <div className="flex gap-3">
          <button onClick={onEdit} className="text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors">
            Editar
          </button>
          <button
            onClick={() => { if (window.confirm('¿Eliminar este gasto?')) onDelete() }}
            className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
