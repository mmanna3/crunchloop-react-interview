import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTodoLists } from './hooks/useTodoLists'
import { useCreateTodoList } from './hooks/useCreateTodoList'
import { useDeleteTodoList } from './hooks/useDeleteTodoList'

export function TodoLists() {
  const { data, isLoading, error } = useTodoLists()
  const { mutate: createTodoList, isPending } = useCreateTodoList()
  const { mutate: deleteTodoList, isPending: isDeleting } = useDeleteTodoList()

  const [title, setTitle] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) return

    createTodoList({ name: title })
    setTitle('')
  }

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error</p>

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva lista"
        />
        <button type="submit" disabled={isPending}>
          Crear
        </button>
      </form>

      <ul>
        {data?.map((list) => (
          <li key={list.id}>
            <Link to={`/lists/${list.id}`}>
              {list.name}
            </Link>
            <button onClick={() => deleteTodoList(list.id!)} disabled={isDeleting}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}