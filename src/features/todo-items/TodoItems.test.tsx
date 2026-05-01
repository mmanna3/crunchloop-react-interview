import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { server } from '../../test/server'
import { renderWithProviders } from '../../test/renderWithProviders'
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
  it('renders the list name and items received from the server', async () => {
    renderTodoItems(['/lists/2'])

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('List 2')
      expect(screen.getByLabelText(/Item list 2/i)).toBeChecked()
    })
  })

  it('shows error when the server fails to load the items', async () => {
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
