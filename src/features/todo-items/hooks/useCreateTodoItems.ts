import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoItemsApi } from '../../../api/todoItems'

type CreateTodoItemInput = {
    listId: number
    description: string
}

export function useCreateTodoItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ listId, description }: CreateTodoItemInput) =>
            todoItemsApi.create(listId, { description }),

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['todoitems', variables.listId],
            })
        },
    })
}