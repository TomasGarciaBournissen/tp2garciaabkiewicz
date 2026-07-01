export function calcularProgreso(completados, total) {
  if (total <= 0) return 0
  return (completados / total) * 100
}
