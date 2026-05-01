import { test, expect } from '@playwright/test'

test('muestra las listas devueltas por el mock de /api/todolists', async ({ page }) => {
  const mockedLists = [
    { id: 1, name: 'Lista de compras', todoItems: [] },
    { id: 2, name: 'Tareas del proyecto', todoItems: [] },
  ]

  await page.route('**/api/todolists', async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue()
      return
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockedLists),
    })
  })

  await page.goto('/')

  await expect(page.getByText('Lista de compras')).toBeVisible()
  await expect(page.getByText('Tareas del proyecto')).toBeVisible()
})
