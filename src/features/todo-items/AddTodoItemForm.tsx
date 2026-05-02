import { FormEvent, useState } from 'react'
import { useCreateTodoItem } from './hooks/useCreateTodoItems'

type AddTodoItemFormProps = {
  listId: number
}

export function AddTodoItemForm({ listId }: AddTodoItemFormProps) {
  const [description, setDescription] = useState('')
  const { mutate: createTodoItem, isPending } = useCreateTodoItem()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!description.trim()) return
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
        <input
          id="new-todo-item"
          className="field"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="New item"
          autoComplete="off"
        />
      </div>
      <button type="submit" className="btn-primary shrink-0" disabled={isPending}>
        Add
      </button>
    </form>
  )
}
