export function formatARS(monto) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monto)
}

export function mesLabel(fecha = new Date()) {
  return fecha.toLocaleString('es-AR', { month: 'long', year: 'numeric' }).toUpperCase()
}
