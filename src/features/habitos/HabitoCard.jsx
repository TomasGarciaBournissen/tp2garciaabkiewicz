export default function HabitoCard({ habito, onEdit, onDelete, completadoHoy, onToggle }) {
  return (
    <div style={{
      background: '#161b27',
      border: completadoHoy ? '1px solid rgba(34,197,94,0.3)' : '1px solid #1e2540',
      borderRadius: 14,
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      transition: 'border-color 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: 10,
            background: habito.color + '22',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: habito.color }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f0f2f8' }}>{habito.nombre}</p>
            {habito.descripcion && (
              <p style={{ fontSize: 12, color: '#4a5278', marginTop: 2 }}>{habito.descripcion}</p>
            )}
          </div>
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: '#4a5278',
          background: '#1e2540',
          borderRadius: 6,
          padding: '3px 8px',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          {habito.frecuencia}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onToggle}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
            border: 'none',
            background: completadoHoy ? '#22c55e' : '#1e2540',
            color: completadoHoy ? '#000' : '#4a5278',
          }}
        >
          {completadoHoy && (
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {completadoHoy ? 'Completado' : 'Marcar hecho'}
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onEdit}
            style={{ fontSize: 12, color: '#4a5278', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f0f2f8'}
            onMouseLeave={e => e.currentTarget.style.color = '#4a5278'}
          >
            Editar
          </button>
          <button
            onClick={() => { if (window.confirm('¿Eliminar este hábito?')) onDelete() }}
            style={{ fontSize: 12, color: '#4a5278', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#4a5278'}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}
