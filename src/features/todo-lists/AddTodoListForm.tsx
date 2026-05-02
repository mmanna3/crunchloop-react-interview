import { FormEvent, useState } from 'react'
import { CharacterCount } from '../../components/CharacterCount'
import { TODO_LIST_NAME_MAX_LENGTH } from '../../constants/textLimits'
import { useCreateTodoList } from './hooks/useCreateTodoList'

export function AddTodoListForm() {
  const [title, setTitle] = useState('')
  const { mutate: createTodoList, isPending } = useCreateTodoList()

  const canSubmit =
    title.trim().length > 0 && title.length <= TODO_LIST_NAME_MAX_LENGTH

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    createTodoList({ name: title })
    setTitle('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <label htmlFor="new-list-name" className="mb-2 block text-xs font-medium text-zinc-500">
          New list
        </label>
        <input
          id="new-list-name"
          className="field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New list"
          autoComplete="off"
        />
        <div className="mt-1 flex justify-end">
          <CharacterCount length={title.length} max={TODO_LIST_NAME_MAX_LENGTH} />
        </div>
      </div>
      <button type="submit" className="btn-primary shrink-0" disabled={isPending || !canSubmit}>
        Create
      </button>
    </form>
  )
}
