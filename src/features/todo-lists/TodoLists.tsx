import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTodoLists } from './hooks/useTodoLists'
import { useCreateTodoList } from './hooks/useCreateTodoList'
import { useDeleteTodoList } from './hooks/useDeleteTodoList'
import { useUpdateTodoList } from './hooks/useUpdateTodoList'

export function TodoLists() {
  const { data, isLoading, error } = useTodoLists()
  const { mutate: createTodoList, isPending } = useCreateTodoList()
  const { mutate: deleteTodoList, isPending: isDeleting } = useDeleteTodoList()
  const { mutate: updateTodoList, isPending: isUpdating } = useUpdateTodoList()

  const [title, setTitle] = useState('')

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  function startEditing(list: { id: number; name: string }) {
    setEditingId(list.id)
    setEditingName(list.name)
  }

  function handleUpdate(id: number) {
    if (!editingName.trim()) return

    updateTodoList({ id, name: editingName })
    setEditingId(null)
    setEditingName('')
  }

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
            {editingId === list.id ? (
              <>
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleUpdate(list.id!)} disabled={isUpdating}>
                  Guardar
                </button>
                <button onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <Link to={`/lists/${list.id}`}>
                  {list.name}
                </Link>
                <button onClick={() => startEditing({ id: list.id!, name: list.name! })}>
                  Editar
                </button>
                <button onClick={() => deleteTodoList(list.id!)} disabled={isDeleting}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}