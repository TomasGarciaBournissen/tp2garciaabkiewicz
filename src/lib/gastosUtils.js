export function calcularTotalGastos(gastos) {
  return gastos.reduce((sum, g) => sum + Number(g.monto), 0)
}

export function filtrarPorCategoria(gastos, categoria) {
  if (categoria === 'Todas') return gastos
  return gastos.filter(g => g.categoria === categoria)
}
