function formatARS(n) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}

function formatFecha(fecha) {
  return new Date(fecha + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

const CATEGORIA_COLORS = {
  Alimentación: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
  Transporte: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Entretenimiento: { bg: 'rgba(168,85,247,0.12)', text: '#a855f7' },
  Salud: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  Educación: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  Hogar: { bg: 'rgba(251,146,60,0.12)', text: '#fb923c' },
  Otro: { bg: 'rgba(74,82,120,0.2)', text: '#4a5278' },
}

export default function GastoItem({ gasto, onEdit, onDelete }) {
  const color = CATEGORIA_COLORS[gasto.categoria] ?? CATEGORIA_COLORS.Otro

  return (
    <div
      style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'background 0.15s', cursor: 'default' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
        <div style={{
          width: 36, height: 36,
          background: color.bg,
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: color.text }}>
            {gasto.categoria[0]}
          </span>
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: '#f0f2f8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {gasto.descripcion || gasto.categoria}
          </p>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#4a5278', marginTop: 2 }}>
            {gasto.descripcion ? gasto.categoria + ' · ' : ''}{formatFecha(gasto.fecha)}
          </p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 500, color: '#f0f2f8' }}>
          {formatARS(gasto.monto)}
        </span>
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
            onClick={() => { if (window.confirm('¿Eliminar este gasto?')) onDelete() }}
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
