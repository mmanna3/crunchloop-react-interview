import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  it('creating an item sends POST with the given description', async () => {
    const newItemDescription = 'New todo item'

    let requestBody: unknown
    server.use(
      http.post(`${BASE_URL}/api/todolists/:listId/items`, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({
          id: 999,
          description: newItemDescription,
          isCompleted: false,
        })
      }),
    )

    const user = userEvent.setup()
    renderTodoItems(['/lists/1'])

    await waitFor(() => {
      expect(screen.getByLabelText(/Item list 1/i)).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('New item'), newItemDescription)
    await user.click(screen.getByRole('button', { name: 'Add' }))

    await waitFor(() => {
      expect(requestBody).toEqual({ description: newItemDescription })
    })
  })

  it('clicking Save sends PUT with the item id and updated payload', async () => {
    let updatedItemId: number | null = null
    let requestBody: unknown
    server.use(
      http.put(
        `${BASE_URL}/api/todolists/:listId/items/:itemId`,
        async ({ params, request }) => {
          updatedItemId = Number(params.itemId)
          requestBody = await request.json()
          return new HttpResponse(null, { status: 204 })
        }
      ),
    )

    const user = userEvent.setup()
    renderTodoItems(['/lists/1'])

    await waitFor(() => {
      expect(screen.getByLabelText(/Item list 1/i)).toBeInTheDocument()
    })

    const itemListEntry = screen.getByLabelText(/Item list 1/i).closest('li')!
    await user.click(within(itemListEntry).getByRole('button', { name: 'Edit' }))

    const newDescription = 'Renamed item'
    const descriptionInput = within(itemListEntry).getByRole('textbox')
    await user.clear(descriptionInput)
    await user.type(descriptionInput, newDescription)
    await user.click(within(itemListEntry).getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(updatedItemId).toBe(10)
      expect(requestBody).toEqual({
        description: newDescription,
        isCompleted: false,
      })
    })
  })

  it('deleting an item sends DELETE with the correct id', async () => {
    let deletedItemId: number | null = null
    server.use(
      http.delete(`${BASE_URL}/api/todolists/:listId/items/:itemId`, ({ params }) => {
        deletedItemId = Number(params.itemId)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const user = userEvent.setup()
    renderTodoItems(['/lists/1'])

    await waitFor(() => {
      expect(screen.getByLabelText(/Item list 1/i)).toBeInTheDocument()
    })

    const itemListEntry = screen.getByLabelText(/Item list 1/i).closest('li')!
    await user.click(within(itemListEntry).getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(deletedItemId).toBe(10)
    })
  })
})
