import { test, expect } from '@playwright/test'
import { mockSupabase } from './mockSupabase.js'

test('usuario no autenticado es redirigido al login al intentar acceder a /dashboard', async ({ page }) => {
  await mockSupabase(page)
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login$/)
})

test('login exitoso, creación de un gasto y verificación en el listado', async ({ page }) => {
  await mockSupabase(page)

  await page.goto('/login')
  await page.getByPlaceholder('tu@email.com').fill('e2e@example.com')
  await page.getByPlaceholder('••••••••').fill('password123')
  await page.getByRole('button', { name: 'Ingresar' }).click()

  await expect(page).toHaveURL(/\/dashboard$/)

  await page.getByRole('link', { name: /Ver gastos/ }).click()
  await expect(page).toHaveURL(/\/gastos$/)
  await expect(page.getByText('Sin gastos este mes')).toBeVisible()

  await page.getByRole('button', { name: '+ Nuevo gasto' }).click()
  await page.locator('input[type="number"]').fill('1500')
  await page.locator('input[placeholder="Opcional"]').fill('Compra E2E')
  await page.getByRole('button', { name: 'Registrar gasto' }).click()

  await expect(page.getByText('Compra E2E')).toBeVisible()
  await expect(page.getByText(/\$\s*1\.500/).last()).toBeVisible()
})
