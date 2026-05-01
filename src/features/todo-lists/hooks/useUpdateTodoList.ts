import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoListsApi } from '../../../api/todoLists'

export function useUpdateTodoList() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, name }: { id: number, name: string }) =>
            todoListsApi.update(id, { name }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todolists'] })
        },
    })
}