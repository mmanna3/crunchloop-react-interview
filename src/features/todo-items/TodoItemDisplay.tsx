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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <label className="flex min-w-0 cursor-pointer items-start gap-3 sm:flex-1 sm:items-center sm:pr-2">
        <input
          type="checkbox"
          checked={item.isCompleted}
          onChange={(e) => onToggle(id, e.target.checked)}
          className="size-4.5 shrink-0 rounded-md border border-zinc-300 accent-accent checked:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
        />
        <span
          className={`min-w-0 wrap-break-word text-[15px] leading-snug text-zinc-900 ${
            item.isCompleted ? 'text-zinc-400 line-through' : ''
          }`}
        >
          {description}
        </span>
      </label>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button type="button" className="btn-secondary" onClick={() => onEdit({ id, description })}>
          Edit
        </button>
        <button type="button" className="btn-danger" onClick={() => onDelete(id)} disabled={isDeleting}>
          Delete
        </button>
      </div>
    </div>
  )
}
