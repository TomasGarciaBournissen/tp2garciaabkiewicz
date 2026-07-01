import { describe, expect, it } from 'vitest'
import { calcularTotalGastos, filtrarPorCategoria } from './gastosUtils'

describe('calcularTotalGastos', () => {
  it('suma los montos de una lista de gastos', () => {
    const gastos = [{ monto: 100 }, { monto: 250.5 }, { monto: 49.5 }]
    expect(calcularTotalGastos(gastos)).toBe(400)
  })

  it('devuelve 0 para una lista vacía', () => {
    expect(calcularTotalGastos([])).toBe(0)
  })

  it('convierte montos guardados como string a número', () => {
    const gastos = [{ monto: '100' }, { monto: '50' }]
    expect(calcularTotalGastos(gastos)).toBe(150)
  })
})

describe('filtrarPorCategoria', () => {
  const gastos = [
    { id: 1, categoria: 'Transporte' },
    { id: 2, categoria: 'Alimentación' },
    { id: 3, categoria: 'Transporte' },
  ]

  it('devuelve todos los gastos cuando la categoría es "Todas"', () => {
    expect(filtrarPorCategoria(gastos, 'Todas')).toHaveLength(3)
  })

  it('filtra solo los gastos de la categoría pedida', () => {
    const resultado = filtrarPorCategoria(gastos, 'Transporte')
    expect(resultado).toHaveLength(2)
    expect(resultado.every(g => g.categoria === 'Transporte')).toBe(true)
  })

  it('devuelve un array vacío si ningún gasto matchea la categoría', () => {
    expect(filtrarPorCategoria(gastos, 'Educación')).toEqual([])
  })
})
