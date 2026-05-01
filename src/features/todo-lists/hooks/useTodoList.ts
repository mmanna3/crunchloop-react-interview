import { useQuery } from '@tanstack/react-query'
import { todoListsApi } from '../../../api/todoLists'

export function useTodoList(listId: number, enabled: boolean) {
  return useQuery({
    queryKey: ['todolist', listId],
    queryFn: () => todoListsApi.getById(listId),
    enabled,
  })
}