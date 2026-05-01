import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoItemsApi } from '../../../api/todoItems'

type ToggleTodoItemInput = {
    listId: number
    itemId: number
    isCompleted: boolean
}

export function useToggleTodoItem() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ listId, itemId, isCompleted }: ToggleTodoItemInput) => {
            const items = queryClient.getQueryData<any[]>(['todoitems', listId]) || []

            const currentItem = items.find((i) => i.id === itemId)

            if (!currentItem) {
                throw new Error('Item not found in cache')
            }

            return todoItemsApi.update(listId, itemId, {
                description: currentItem.description,
                isCompleted,
            })
        },

        onMutate: async ({ listId, itemId, isCompleted }) => {
            await queryClient.cancelQueries({ queryKey: ['todoitems', listId] })

            const previous = queryClient.getQueryData(['todoitems', listId])

            queryClient.setQueryData(['todoitems', listId], (old: any[] = []) =>
                old.map((item) =>
                    item.id === itemId ? { ...item, isCompleted } : item
                )
            )

            return { previous }
        },

        onError: (_err, variables, context) => {
            queryClient.setQueryData(
                ['todoitems', variables.listId],
                context?.previous
            )
        },

        onSettled: (_data, _error, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['todoitems', variables.listId],
            })
        },
    })
}