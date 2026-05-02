import { useEffect, useState } from 'react'
import { useUpdateTodoList } from './hooks/useUpdateTodoList'

type TodoListInlineEditorProps = {
  listId: number
  initialName: string
  onCancel: () => void
  onSaved: () => void
}

export function TodoListInlineEditor({
  listId,
  initialName,
  onCancel,
  onSaved,
}: TodoListInlineEditorProps) {
  const [name, setName] = useState(initialName)
  const { mutate: updateTodoList, isPending: isUpdating } = useUpdateTodoList()

  useEffect(() => {
    setName(initialName)
  }, [initialName, listId])

  function handleSave() {
    if (!name.trim()) return
    updateTodoList(
      { id: listId, name },
      { onSuccess: onSaved },
    )
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <input
        className="field flex-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
        aria-label="List name"
      />
      <div className="flex shrink-0 gap-2">
        <button type="button" className="btn-primary" onClick={handleSave} disabled={isUpdating}>
          Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
