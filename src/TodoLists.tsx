import { useQuery } from '@tanstack/react-query'
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
        <li key={list.id}>{list.name}</li>
      ))}
    </ul>
  )
}
