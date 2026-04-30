export default function HabitoCard({ habito, onEdit, onDelete, completadoHoy, onToggle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: habito.color }}
          />
          <div>
            <p className="font-medium text-gray-900">{habito.nombre}</p>
            {habito.descripcion && (
              <p className="text-xs text-gray-500 mt-0.5">{habito.descripcion}</p>
            )}
          </div>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 capitalize flex-shrink-0">
          {habito.frecuencia}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
        <button
          onClick={onToggle}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            completadoHoy
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {completadoHoy ? '✓ Completado hoy' : 'Marcar como hecho'}
        </button>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Editar
          </button>
          <button
            onClick={() => {
              if (window.confirm('¿Eliminar este hábito?')) onDelete()
            }}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
