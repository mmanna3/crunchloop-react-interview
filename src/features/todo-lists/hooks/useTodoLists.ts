import { useQuery } from '@tanstack/react-query'
import { todoListsApi } from '../../../api/todoLists'

export function useTodoLists() {
    return useQuery({
        queryKey: ['todolists'],
        queryFn: todoListsApi.getAll,
    })
}