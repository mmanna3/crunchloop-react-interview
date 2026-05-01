import { screen, fireEvent, waitFor } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import { renderWithProviders } from '../../test/renderWithProviders'
import { TodoItems } from './TodoItems'
import { todoListsApi } from '../../api/todoLists'

vi.mock('./hooks/useBulkCompleteListener', () => ({
  useBulkCompleteListener: vi.fn(),
}))

vi.mock('../../api/todoLists', () => ({
  todoListsApi: {
    completeAllItems: vi.fn(() => Promise.resolve({})),
  },
}))

vi.mock('./hooks/useTodoItems', () => ({
  useTodoItems: () => ({
    data: [
      { id: 1, description: 'Item 1', isCompleted: false },
      { id: 2, description: 'Item 2', isCompleted: false },
    ],
    isLoading: false,
    error: null,
  }),
}))

vi.mock('../todo-lists/hooks/useTodoList', () => ({
  useTodoList: () => ({
    data: { id: 1, name: 'Test List' },
    isLoading: false,
  }),
}))

import { useBulkCompleteListener } from './hooks/useBulkCompleteListener'

function renderTodoItems() {
  return renderWithProviders(
    <Routes>
      <Route path="/lists/:listId" element={<TodoItems />} />
    </Routes>,
    ['/lists/1']
  )
}

describe('TodoItems - bulk complete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(todoListsApi.completeAllItems).mockResolvedValue({} as never)
  })

  it('calls connect and completeAllItems when Complete all is clicked', async () => {
    const mockConnect = vi.fn().mockResolvedValue('conn-1')

    vi.mocked(useBulkCompleteListener).mockReturnValue({
      connect: mockConnect,
      progress: null,
    })

    renderTodoItems()

    fireEvent.click(screen.getByRole('button', { name: 'Complete all items' }))

    await waitFor(() => {
      expect(mockConnect).toHaveBeenCalled()
      expect(todoListsApi.completeAllItems).toHaveBeenCalledWith(1, 'conn-1')
    })
  })

  it('shows initial progress counts while bulk completion is running', () => {
    vi.mocked(useBulkCompleteListener).mockReturnValue({
      connect: vi.fn(),
      progress: {
        completed: 0,
        total: 100,
        isFinished: false,
        completedIds: [],
      },
    })

    renderTodoItems()

    expect(screen.getByText(/0 \/ 100/)).toBeInTheDocument()
  })

  it('updates progress when events arrive', () => {
    vi.mocked(useBulkCompleteListener).mockReturnValue({
      connect: vi.fn(),
      progress: {
        completed: 50,
        total: 100,
        isFinished: false,
        completedIds: [],
      },
    })

    renderTodoItems()

    expect(screen.getByText(/50 \/ 100/)).toBeInTheDocument()
  })

  it('shows Complete all button again when bulk finishes', () => {
    vi.mocked(useBulkCompleteListener).mockReturnValue({
      connect: vi.fn(),
      progress: {
        completed: 100,
        total: 100,
        isFinished: true,
        completedIds: [1, 2],
      },
    })

    renderTodoItems()

    expect(screen.queryByText(/Completing\.\.\./)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Complete all items' })
    ).toBeInTheDocument()
  })
})
