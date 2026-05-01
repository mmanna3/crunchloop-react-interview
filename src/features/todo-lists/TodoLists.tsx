import { Link } from 'react-router-dom'
import { useTodoLists } from './hooks/useTodoLists'

export function TodoLists() {
  const { data, isLoading, error } = useTodoLists()

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
