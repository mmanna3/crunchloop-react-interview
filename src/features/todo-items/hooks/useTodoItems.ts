import { useQuery } from '@tanstack/react-query'
import { todoItemsApi } from '../../../api/todoItems'

export function useTodoItems(listId: number) {
    return useQuery({
        queryKey: ['todoitems', listId],
        queryFn: () => todoItemsApi.getAll(listId),
        enabled: Number.isFinite(listId),
    })
}