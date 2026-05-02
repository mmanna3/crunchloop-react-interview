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
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New list"
      />
      <button type="submit" disabled={isPending}>
        Create
      </button>
    </form>
  )
}
