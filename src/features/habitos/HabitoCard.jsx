export default function HabitoCard({ habito, onEdit, onDelete, completadoHoy, onToggle }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 flex flex-col gap-4 transition-all ${completadoHoy ? 'border-emerald-200' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: habito.color + '22' }}
          >
            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: habito.color }} />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{habito.nombre}</p>
            {habito.descripcion && (
              <p className="text-xs text-gray-400 mt-0.5">{habito.descripcion}</p>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2.5 py-1 capitalize flex-shrink-0">
          {habito.frecuencia}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={onToggle}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
            completadoHoy
              ? 'bg-emerald-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {completadoHoy && (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {completadoHoy ? 'Completado' : 'Marcar como hecho'}
        </button>
        <div className="flex gap-3">
          <button onClick={onEdit} className="text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors">
            Editar
          </button>
          <button
            onClick={() => { if (window.confirm('¿Eliminar este hábito?')) onDelete() }}
            className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
