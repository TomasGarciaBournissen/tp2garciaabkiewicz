import { useState } from 'react'

const CATEGORIAS = ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Educación', 'Hogar', 'Otro']

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

export default function GastoForm({ initial, onSubmit, onCancel }) {
  const [monto, setMonto] = useState(initial?.monto ?? '')
  const [categoria, setCategoria] = useState(initial?.categoria ?? 'Alimentación')
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '')
  const [fecha, setFecha] = useState(initial?.fecha ?? new Date().toISOString().slice(0, 10))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [focused, setFocused] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSubmit({ monto: parseFloat(monto), categoria, descripcion, fecha })
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
        {initial ? 'Editar gasto' : 'Nuevo gasto'}
      </h2>
      {error && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 10, fontSize: 13, color: '#f87171' }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={lbl}>Monto (ARS)</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            onFocus={() => setFocused('monto')}
            onBlur={() => setFocused(null)}
            style={{ ...inp, borderColor: focused === 'monto' ? '#22c55e' : '#1e2540' }}
            placeholder="0"
          />
        </div>
        <div>
          <label style={lbl}>Fecha</label>
          <input
            type="date"
            required
            value={fecha}
            onChange={e => setFecha(e.target.value)}
            onFocus={() => setFocused('fecha')}
            onBlur={() => setFocused(null)}
            style={{ ...inp, borderColor: focused === 'fecha' ? '#22c55e' : '#1e2540', colorScheme: 'dark' }}
          />
        </div>
      </div>
      <div>
        <label style={lbl}>Categoría</label>
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          onFocus={() => setFocused('cat')}
          onBlur={() => setFocused(null)}
          style={{ ...inp, borderColor: focused === 'cat' ? '#22c55e' : '#1e2540' }}
        >
          {CATEGORIAS.map(c => <option key={c} style={{ background: '#161b27' }}>{c}</option>)}
        </select>
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
          {loading ? 'Guardando...' : initial ? 'Guardar cambios' : 'Registrar gasto'}
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
