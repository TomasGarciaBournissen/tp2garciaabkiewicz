import { describe, expect, it } from 'vitest'
import { formatARS, mesLabel } from './format'

describe('formatARS', () => {
  it('formatea un monto positivo como moneda ARS sin decimales', () => {
    expect(formatARS(1500)).toMatch(/^\$\s*1\.500$/)
  })

  it('formatea 0 correctamente', () => {
    expect(formatARS(0)).toMatch(/^\$\s*0$/)
  })

  it('redondea montos con decimales', () => {
    expect(formatARS(1500.75)).toMatch(/^\$\s*1\.501$/)
  })
})

describe('mesLabel', () => {
  it('devuelve el mes y año en mayúsculas', () => {
    const fecha = new Date('2026-03-15T12:00:00')
    expect(mesLabel(fecha)).toBe('MARZO DE 2026')
  })
})
