import { Link } from 'react-router-dom'
import type { TodoList } from '../../api/todoLists'
import { useDeleteTodoList } from './hooks/useDeleteTodoList'
import { TodoListInlineEditor } from './TodoListInlineEditor'

type TodoListDisplayProps = {
  lists: TodoList[]
  editingId: number | null
  onStartEdit: (list: TodoList) => void
  onCancelEdit: () => void
  onEditSaved: () => void
}

export function TodoListDisplay({
  lists,
  editingId,
  onStartEdit,
  onCancelEdit,
  onEditSaved,
}: TodoListDisplayProps) {
  const { mutate: deleteTodoList, isPending: isDeleting } = useDeleteTodoList()

  if (lists.length === 0) {
    return (
      <div className="card px-6 py-12 text-center">
        <p className="text-sm text-zinc-500">No lists yet — create one above.</p>
      </div>
    )
  }

  return (
    <ul className="space-y-2">
      {lists.map((list) => (
        <li key={list.id} className="card overflow-hidden">
          {editingId === list.id ? (
            <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-3">
              <TodoListInlineEditor
                listId={list.id!}
                initialName={list.name ?? ''}
                onCancel={onCancelEdit}
                onSaved={onEditSaved}
              />
            </div>
          ) : (
            <div className="group relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <Link
                to={`/lists/${list.id}`}
                className="absolute inset-0 z-0 block size-full rounded-[inherit]"
                aria-label={list.name ?? 'Open list'}
              />
              <span className="relative z-10 min-w-0 flex-1 pointer-events-none text-base font-medium text-zinc-900 underline-offset-4 transition-colors group-hover:text-accent group-hover:underline">
                {list.name}
              </span>
              <div className="relative z-10 flex shrink-0 flex-wrap gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onStartEdit(list)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => deleteTodoList(list.id!)}
                  disabled={isDeleting}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
