import type { components } from '../../api/types'

type TodoItemDTO = components['schemas']['TodoItemDTO']

type TodoItemDisplayProps = {
  item: TodoItemDTO
  onToggle: (itemId: number, isCompleted: boolean) => void
  onEdit: (item: { id: number; description: string }) => void
  onDelete: (itemId: number) => void
  isDeleting: boolean
}

export function TodoItemDisplay({
  item,
  onToggle,
  onEdit,
  onDelete,
  isDeleting,
}: TodoItemDisplayProps) {
  const id = item.id!
  const description = item.description!

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={item.isCompleted}
          onChange={(e) => onToggle(id, e.target.checked)}
        />
        {description}
      </label>
      <button type="button" onClick={() => onEdit({ id, description })}>
        Edit
      </button>
      <button
        type="button"
        onClick={() => onDelete(id)}
        disabled={isDeleting}
      >
        Delete
      </button>
    </>
  )
}
