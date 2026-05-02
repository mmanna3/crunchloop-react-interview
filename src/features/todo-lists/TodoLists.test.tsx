import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { TODO_LIST_NAME_MAX_LENGTH } from '../../constants/textLimits'
import { server } from '../../test/server'
import { renderWithProviders } from '../../test/renderWithProviders'
import { TodoLists } from './TodoLists'

const BASE_URL = 'https://localhost:7027'

describe('TodoLists', () => {
  it('renders lists returned from the server', async () => {
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByText('List 1')).toBeInTheDocument()
      expect(screen.getByText('List 2')).toBeInTheDocument()
    })
  })

  it('shows error when the server fails', async () => {
    server.use(
      http.get(`${BASE_URL}/api/todolists`, () =>
        HttpResponse.json(null, { status: 500 })
      )
    )

    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('creating a list sends POST with the given name', async () => {
    const newListName = 'New list'

    let requestBody: unknown
    server.use(
      http.post(`${BASE_URL}/api/todolists`, async ({ request }) => {
        requestBody = await request.json()
        return HttpResponse.json({ id: 3, name: newListName })
      }),
    )

    const user = userEvent.setup()
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByText('List 1')).toBeInTheDocument()
    })

    await user.type(screen.getByPlaceholderText('New list'), newListName)
    await user.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(requestBody).toEqual({ name: newListName })
    })
  })

  it('deleting a list sends DELETE with the correct id', async () => {
    let deletedListId: number | null = null
    server.use(
      http.delete(`${BASE_URL}/api/todolists/:listId`, ({ params }) => {
        deletedListId = Number(params.listId)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const user = userEvent.setup()
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'List 2' })).toBeInTheDocument()
    })

    const listItem = screen.getByRole('link', { name: 'List 2' }).closest('li')!
    await user.click(within(listItem).getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(deletedListId).toBe(2)
    })
  })

  it('clicking Edit shows Save and Cancel for that list', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'List 1' })).toBeInTheDocument()
    })

    const listItem = screen.getByRole('link', { name: 'List 1' }).closest('li')!
    await user.click(within(listItem).getByRole('button', { name: 'Edit' }))

    expect(within(listItem).getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(within(listItem).getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('clicking Cancel hides Save and Cancel', async () => {
    const user = userEvent.setup()
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'List 1' })).toBeInTheDocument()
    })

    const listItem = screen.getByRole('link', { name: 'List 1' }).closest('li')!
    await user.click(within(listItem).getByRole('button', { name: 'Edit' }))

    await user.click(within(listItem).getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
  })

  it('clicking Save sends PUT with the list id and new name', async () => {
    let updatedListId: number | null = null
    let requestBody: unknown
    server.use(
      http.put(`${BASE_URL}/api/todolists/:listId`, async ({ params, request }) => {
        updatedListId = Number(params.listId)
        requestBody = await request.json()
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const user = userEvent.setup()
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'List 1' })).toBeInTheDocument()
    })

    const listItem = screen.getByRole('link', { name: 'List 1' }).closest('li')!
    await user.click(within(listItem).getByRole('button', { name: 'Edit' }))

    const newName = 'Renamed list'
    const nameInput = within(listItem).getByRole('textbox')
    await user.clear(nameInput)
    await user.type(nameInput, newName)
    await user.click(within(listItem).getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(updatedListId).toBe(1)
      expect(requestBody).toEqual({ name: newName })
    })
  })

  describe('list name length limit', () => {
    function getCreateForm() {
      const createBtn = screen.getByRole('button', { name: 'Create' })
      return createBtn.closest('form')!
    }

    it('shows live character count when creating a list', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TodoLists />)

      await waitFor(() => {
        expect(screen.getByText('List 1')).toBeInTheDocument()
      })

      const form = getCreateForm()
      expect(within(form).getByText(`0/${TODO_LIST_NAME_MAX_LENGTH}`)).toBeInTheDocument()

      await user.type(
        within(form).getByPlaceholderText('New list'),
        'Hello',
      )
      expect(
        within(form).getByText(`5/${TODO_LIST_NAME_MAX_LENGTH}`),
      ).toBeInTheDocument()
    })

    it('disables Create and turns the counter red when name is over the limit', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TodoLists />)

      await waitFor(() => {
        expect(screen.getByText('List 1')).toBeInTheDocument()
      })

      const form = getCreateForm()
      const longName = 'x'.repeat(TODO_LIST_NAME_MAX_LENGTH + 1)
      await user.type(within(form).getByPlaceholderText('New list'), longName)

      const counter = within(form).getByText(
        `${longName.length}/${TODO_LIST_NAME_MAX_LENGTH}`,
      )
      expect(counter).toHaveClass('text-red-600')
      expect(within(form).getByRole('button', { name: 'Create' })).toBeDisabled()
    })

    it('does not attempt POST when Create is disabled due to length', async () => {
      let postCalls = 0
      server.use(
        http.post(`${BASE_URL}/api/todolists`, async () => {
          postCalls += 1
          return HttpResponse.json({ id: 99, name: 'x' })
        }),
      )

      const user = userEvent.setup()
      renderWithProviders(<TodoLists />)

      await waitFor(() => {
        expect(screen.getByText('List 1')).toBeInTheDocument()
      })

      const form = getCreateForm()
      await user.type(
        within(form).getByPlaceholderText('New list'),
        'x'.repeat(TODO_LIST_NAME_MAX_LENGTH + 1),
      )

      const create = within(form).getByRole('button', { name: 'Create' })
      expect(create).toBeDisabled()
      await user.click(create)
      expect(postCalls).toBe(0)
    })

    it('disables Save in inline editor when name exceeds the limit', async () => {
      const user = userEvent.setup()
      renderWithProviders(<TodoLists />)

      await waitFor(() => {
        expect(screen.getByRole('link', { name: 'List 1' })).toBeInTheDocument()
      })

      const listItem = screen.getByRole('link', { name: 'List 1' }).closest('li')!
      await user.click(within(listItem).getByRole('button', { name: 'Edit' }))

      const nameInput = within(listItem).getByRole('textbox', { name: 'List name' })
      await user.clear(nameInput)
      await user.type(nameInput, 'y'.repeat(TODO_LIST_NAME_MAX_LENGTH + 1))

      expect(
        within(listItem).getByText(`${TODO_LIST_NAME_MAX_LENGTH + 1}/${TODO_LIST_NAME_MAX_LENGTH}`),
      ).toHaveClass('text-red-600')
      expect(within(listItem).getByRole('button', { name: 'Save' })).toBeDisabled()
    })
  })
})
