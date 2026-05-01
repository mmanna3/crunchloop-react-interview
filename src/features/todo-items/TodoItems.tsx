import { Link, useParams } from 'react-router-dom'
import { useTodoItems } from './hooks/useTodoItems'
import { useTodoList } from '../todo-lists/hooks/useTodoList'
import { useState } from 'react'
import { useCreateTodoItem } from './hooks/useCreateTodoItems'
import { useToggleTodoItem } from './hooks/useToggleTodoItem'
import { useDeleteTodoItem } from './hooks/useDeleteTodoItem'
import { useUpdateTodoItem } from './hooks/useUpdateTodoItem'

export function TodoItems() {
  const { listId: listIdParam } = useParams()
  const listId = Number(listIdParam)
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingDescription, setEditingDescription] = useState('')
  const { mutate: createTodoItem, isPending } = useCreateTodoItem()
  const { mutate: toggleTodoItem } = useToggleTodoItem()
  const { mutate: deleteTodoItem, isPending: isDeleting } = useDeleteTodoItem()
  const { mutate: updateTodoItem, isPending: isUpdating } = useUpdateTodoItem()

  function startEditing(item: { id: number; description: string }) {
    setEditingId(item.id)
    setEditingDescription(item.description)
  }

  function handleUpdate(itemId: number) {
    if (!editingDescription.trim()) return

    updateTodoItem({ listId, itemId, description: editingDescription })
    setEditingId(null)
    setEditingDescription('')
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()

    if (!description.trim()) return

    createTodoItem({ listId, description })
    setDescription('')
  }

  const isValidId = Number.isFinite(listId)

  const { data: listMeta, isLoading: isLoadingList } = useTodoList(
    listId,
    isValidId
  )

  const {
    data: items,
    isLoading: isLoadingItems,
    error,
  } = useTodoItems(listId)

  if (!isValidId) {
    return <p>Invalid list</p>
  }

  const title = listMeta?.name ?? ''

  return (
    <div>
      <p>
        <Link to="/">← Back</Link>
      </p>

      {isLoadingList ? <p>Loading list...</p> : <h1>{title}</h1>}

      <form onSubmit={handleCreate}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="New item"
        />
        <button type="submit" disabled={isPending}>
          Add
        </button>
      </form>

      {isLoadingItems && <p>Loading items...</p>}
      {error && <p>Error</p>}

      {!isLoadingItems && !error && items?.length === 0 && (
        <p>No items yet</p>
      )}

      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <>
                <input
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                />
                <button onClick={() => handleUpdate(item.id!)} disabled={isUpdating}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <label>
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={(e) =>
                      toggleTodoItem({
                        listId,
                        itemId: item.id!,
                        isCompleted: e.target.checked,
                      })
                    }
                  />
                  {item.description}
                </label>
                <button
                  onClick={() =>
                    startEditing({ id: item.id!, description: item.description! })
                  }
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodoItem({ listId, itemId: item.id! })}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}