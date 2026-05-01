import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoListsApi } from '../../../api/todoLists'

export function useCreateTodoList() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: todoListsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todolists'] })
        },
    })
}