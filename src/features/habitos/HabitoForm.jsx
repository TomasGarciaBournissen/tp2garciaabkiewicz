import { useState } from 'react'

const COLORES = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4']

const inp = {
  width: '100%',
  background: '#0f1117',
  border: '1px solid #1e2540',
  borderRadius: 10,
  padding: '11px 14px',
  fontSize: 14,
  color: '#f0f2f8',
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
}

const lbl = {
  display: 'block',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  color: '#4a5278',
  marginBottom: 7,
  fontFamily: "'JetBrains Mono', monospace",
}

export default function HabitoForm({ initial, onSubmit, onCancel }) {
  const [nombre, setNombre] = useState(initial?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '')
  const [frecuencia, setFrecuencia] = useState(initial?.frecuencia ?? 'diaria')
  const [color, setColor] = useState(initial?.color ?? '#22c55e')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ nombre, descripcion, frecuencia, color })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ background: '#161b27', border: '1px solid #1e2540', borderRadius: 14, padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f0f2f8' }}>
        {initial ? 'Editar hábito' : 'Nuevo hábito'}
      </h2>
      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}
      <div>
        <label style={lbl}>Nombre</label>
        <input
          required
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          onFocus={() => setFocused('nombre')}
          onBlur={() => setFocused(null)}
          style={{ ...inp, borderColor: focused === 'nombre' ? '#22c55e' : '#1e2540' }}
          placeholder="Ej: Meditar"
        />
      </div>
      <div>
        <label style={lbl}>Descripción</label>
        <input
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          onFocus={() => setFocused('desc')}
          onBlur={() => setFocused(null)}
          style={{ ...inp, borderColor: focused === 'desc' ? '#22c55e' : '#1e2540' }}
          placeholder="Opcional"
        />
      </div>
      <div>
        <label style={lbl}>Frecuencia</label>
        <select
          value={frecuencia}
          onChange={e => setFrecuencia(e.target.value)}
          onFocus={() => setFocused('frec')}
          onBlur={() => setFocused(null)}
          style={{ ...inp, borderColor: focused === 'frec' ? '#22c55e' : '#1e2540' }}
        >
          <option value="diaria" style={{ background: '#161b27' }}>Diaria</option>
          <option value="semanal" style={{ background: '#161b27' }}>Semanal</option>
        </select>
      </div>
      <div>
        <label style={lbl}>Color</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {COLORES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              style={{
                width: 28, height: 28,
                borderRadius: '50%',
                background: c,
                border: color === c ? '2px solid #f0f2f8' : '2px solid transparent',
                cursor: 'pointer',
                transform: color === c ? 'scale(1.15)' : 'scale(1)',
                transition: 'all 0.15s',
                outline: color === c ? '2px solid ' + c : 'none',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: '#22c55e', color: '#000', border: 'none', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s', fontFamily: 'inherit', opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Crear hábito'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'transparent', color: '#4a5278', border: '1px solid #1e2540', borderRadius: 10,
            padding: '10px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f0f2f8'; e.currentTarget.style.borderColor = '#252d45' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#4a5278'; e.currentTarget.style.borderColor = '#1e2540' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
