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
    return (
      <p className="rounded-2xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
        Invalid list
      </p>
    )
  }

  const title = listMeta?.name ?? ''

  return (
    <div className="space-y-8">
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-800/90 hover:text-accent"
        >
          <span aria-hidden className="text-base leading-none">
            ←
          </span>
          Back to lists
        </Link>

        {isLoadingList ? (
          <p className="mt-6 text-sm text-zinc-500">Loading list...</p>
        ) : (
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            {title}
          </h1>
        )}
      </div>

      <AddTodoItemForm listId={listId} />

      <BulkCompleteToolbar listId={listId} />

      {isLoadingItems && (
        <p className="text-sm text-zinc-500">Loading items...</p>
      )}
      {error && (
        <p className="rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm text-red-800">
          Error loading items.
        </p>
      )}

      {!isLoadingItems && !error && items?.length === 0 && (
        <div className="card px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No items yet — add one above.</p>
        </div>
      )}

      <ul className="space-y-2">
        {items?.map((item) => (
          <li key={item.id} className="card overflow-hidden p-4">
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
