export const FAKE_USER = { id: 'e2e-user-id', email: 'e2e@example.com' }

// Mockea Auth y REST de Supabase a nivel de red: el flujo E2E corre contra
// una API falsa para no depender de un proyecto de Supabase real en CI.
export async function mockSupabase(page) {
  await page.route('**/auth/v1/token**', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'fake-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: 'fake-refresh-token',
        user: FAKE_USER,
      }),
    })
  })

  await page.route('**/rest/v1/habitos**', async route => {
    if (route.request().method() === 'HEAD') {
      await route.fulfill({ status: 200, headers: { 'content-range': '*/0' }, body: '' })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
    }
  })

  let gastoCreado = null

  await page.route('**/rest/v1/gastos**', async route => {
    const request = route.request()
    if (request.method() === 'POST') {
      gastoCreado = { id: 'gasto-e2e-1', user_id: FAKE_USER.id, ...request.postDataJSON() }
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(gastoCreado) })
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(gastoCreado ? [gastoCreado] : []),
      })
    }
  })
}
