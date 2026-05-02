import { Link, useParams } from 'react-router-dom'
import { useTodoItems } from './hooks/useTodoItems'
import { useTodoList } from '../todo-lists/hooks/useTodoList'
import { useState } from 'react'
import { useToggleTodoItem } from './hooks/useToggleTodoItem'
import { useDeleteTodoItem } from './hooks/useDeleteTodoItem'
import { useUpdateTodoItem } from './hooks/useUpdateTodoItem'
import { BulkCompleteToolbar } from './BulkCompleteToolbar'
import { AddTodoItemForm } from './AddTodoItemForm'
import { TodoItemDisplay } from './TodoItemDisplay'
import { TodoItemInlineEditor } from './TodoItemInlineEditor'

export function TodoItems() {
  const { listId: listIdParam } = useParams()
  const listId = Number(listIdParam)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingDescription, setEditingDescription] = useState('')
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

      <AddTodoItemForm listId={listId} />

      <BulkCompleteToolbar listId={listId} />

      {isLoadingItems && <p>Loading items...</p>}
      {error && <p>Error</p>}

      {!isLoadingItems && !error && items?.length === 0 && (
        <p>No items yet</p>
      )}

      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            {editingId === item.id ? (
              <TodoItemInlineEditor
                description={editingDescription}
                onDescriptionChange={setEditingDescription}
                onSave={() => handleUpdate(item.id!)}
                onCancel={() => setEditingId(null)}
                isSaving={isUpdating}
              />
            ) : (
              <TodoItemDisplay
                item={item}
                onToggle={(itemId, isCompleted) =>
                  toggleTodoItem({ listId, itemId, isCompleted })
                }
                onEdit={startEditing}
                onDelete={(itemId) => deleteTodoItem({ listId, itemId })}
                isDeleting={isDeleting}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
