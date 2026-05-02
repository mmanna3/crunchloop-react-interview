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

  return (
    <ul>
      {lists.map((list) => (
        <li key={list.id}>
          {editingId === list.id ? (
            <TodoListInlineEditor
              listId={list.id!}
              initialName={list.name ?? ''}
              onCancel={onCancelEdit}
              onSaved={onEditSaved}
            />
          ) : (
            <>
              <Link to={`/lists/${list.id}`}>{list.name}</Link>
              <button type="button" onClick={() => onStartEdit(list)}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteTodoList(list.id!)}
                disabled={isDeleting}
              >
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}
