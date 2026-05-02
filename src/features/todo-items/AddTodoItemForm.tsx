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
    <form onSubmit={handleSubmit}>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="New item"
      />
      <button type="submit" disabled={isPending}>
        Add
      </button>
    </form>
  )
}
