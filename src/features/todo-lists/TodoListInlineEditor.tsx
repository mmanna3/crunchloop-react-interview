import { useEffect, useState } from 'react'
import { CharacterCount } from '../../components/CharacterCount'
import { TODO_LIST_NAME_MAX_LENGTH } from '../../constants/textLimits'
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

  const canSave = name.trim().length > 0 && name.length <= TODO_LIST_NAME_MAX_LENGTH

  function handleSave() {
    if (!canSave) return
    updateTodoList(
      { id: listId, name },
      { onSuccess: onSaved },
    )
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <input
          className="field w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="List name"
        />
        <div className="mt-1 flex justify-end">
          <CharacterCount length={name.length} max={TODO_LIST_NAME_MAX_LENGTH} />
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={handleSave}
          disabled={isUpdating || !canSave}
        >
          Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
