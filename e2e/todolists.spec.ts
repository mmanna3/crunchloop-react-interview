import { test, expect } from '@playwright/test'

test('shows todo lists on page load', async ({ page }) => {
  const mockedLists = [
    { id: 1, name: 'Shopping list', todoItems: [] },
    { id: 2, name: 'Project tasks', todoItems: [] },
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

  await expect(page.getByText('Shopping list')).toBeVisible()
  await expect(page.getByText('Project tasks')).toBeVisible()
})
