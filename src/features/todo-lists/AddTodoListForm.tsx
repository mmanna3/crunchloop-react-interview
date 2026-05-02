import { FormEvent, useState } from 'react'
import { useCreateTodoList } from './hooks/useCreateTodoList'

export function AddTodoListForm() {
  const [title, setTitle] = useState('')
  const { mutate: createTodoList, isPending } = useCreateTodoList()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
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
      </div>
      <button type="submit" className="btn-primary shrink-0" disabled={isPending}>
        Create
      </button>
    </form>
  )
}
