import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { server } from './test/server'
import { renderWithProviders } from './test/renderWithProviders'
import { TodoItems } from './TodoItems'

const BASE_URL = 'https://localhost:7027'

type MemoryInitialEntries = NonNullable<
  React.ComponentProps<typeof MemoryRouter>['initialEntries']
>

function renderTodoItems(entries: MemoryInitialEntries) {
  return renderWithProviders(
    <Routes>
      <Route path="/lists/:listId" element={<TodoItems />} />
    </Routes>,
    entries
  )
}

describe('TodoItems', () => {
  it('renderiza el nombre de la lista y los ítems recibidos del servidor', async () => {
    renderTodoItems([
      { pathname: '/lists/2', state: { name: 'Lista desde navegación' } },
    ])

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Lista desde navegación'
      )
      expect(screen.getByText(/Item lista 2\s*✓/)).toBeInTheDocument()
    })
  })

  it('muestra error cuando el servidor falla al cargar los ítems', async () => {
    server.use(
      http.get(`${BASE_URL}/api/todolists/:listId/items`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    )

    renderTodoItems(['/lists/1'])

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
