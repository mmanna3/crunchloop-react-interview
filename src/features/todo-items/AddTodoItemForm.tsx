import { FormEvent, useState } from 'react'
import { CharacterCount } from '../../components/CharacterCount'
import { TODO_ITEM_DESCRIPTION_MAX_LENGTH } from '../../constants/textLimits'
import { useCreateTodoItem } from './hooks/useCreateTodoItems'

type AddTodoItemFormProps = {
  listId: number
}

export function AddTodoItemForm({ listId }: AddTodoItemFormProps) {
  const [description, setDescription] = useState('')
  const { mutate: createTodoItem, isPending } = useCreateTodoItem()

  const canSubmit =
    description.trim().length > 0 &&
    description.length <= TODO_ITEM_DESCRIPTION_MAX_LENGTH

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    createTodoItem({ listId, description })
    setDescription('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="new-todo-item" className="mb-2 block text-xs font-medium text-zinc-500">
          New item
        </label>
        <textarea
          id="new-todo-item"
          rows={3}
          className="field min-h-22 w-full resize-y py-2.5"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="New item"
          autoComplete="off"
          aria-label="New item description"
        />
        <div className="mt-1 flex justify-end">
          <CharacterCount
            length={description.length}
            max={TODO_ITEM_DESCRIPTION_MAX_LENGTH}
          />
        </div>
      </div>
      <button type="submit" className="btn-primary shrink-0" disabled={isPending || !canSubmit}>
        Add
      </button>
    </form>
  )
}
