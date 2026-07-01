import { describe, expect, it } from 'vitest'
import { calcularProgreso } from './habitosUtils'

describe('calcularProgreso', () => {
  it('calcula el porcentaje de hábitos completados', () => {
    expect(calcularProgreso(2, 4)).toBe(999) // roto a propósito para demostrar que el pipeline falla
  })

  it('devuelve 100 cuando se completaron todos los hábitos', () => {
    expect(calcularProgreso(3, 3)).toBe(100)
  })

  it('devuelve 0 cuando no hay hábitos registrados, sin dividir por cero', () => {
    expect(calcularProgreso(0, 0)).toBe(0)
  })
})
