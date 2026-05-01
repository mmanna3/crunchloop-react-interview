import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { todoListsApi } from './api/todoLists'

export function TodoLists() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['todolists'],
    queryFn: todoListsApi.getAll,
  })

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <ul>
      {data?.map((list) => (
        <li key={list.id}>
          <Link to={`/lists/${list.id}`} state={{ name: list.name }}>
            {list.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}
