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
    <>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="button" onClick={handleSave} disabled={isUpdating}>
        Save
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </>
  )
}
