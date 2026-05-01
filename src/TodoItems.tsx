import { useQuery } from '@tanstack/react-query'
import { Link, useLocation, useParams } from 'react-router-dom'
import { todoItemsApi } from './api/todoItems'
import { todoListsApi } from './api/todoLists'

type ListLocationState = { name?: string | null }

export function TodoItems() {
  const { listId: listIdParam } = useParams()
  const listId = Number(listIdParam)
  const location = useLocation()
  const nameFromNav = (location.state as ListLocationState | null)?.name

  const { data: listMeta } = useQuery({
    queryKey: ['todolist', listId],
    queryFn: () => todoListsApi.getById(listId),
    enabled: Number.isFinite(listId) && nameFromNav == null,
  })

  const title = nameFromNav ?? listMeta?.name ?? ''

  const {
    data: items,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['todoItems', listId],
    queryFn: () => todoItemsApi.getAll(listId),
    enabled: Number.isFinite(listId),
  })

  if (!Number.isFinite(listId)) {
    return <p>Lista no válida</p>
  }

  return (
    <div>
      <p>
        <Link to="/">← Volver</Link>
      </p>
      <h1>{title}</h1>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            {item.description}
            {item.isCompleted ? ' ✓' : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
