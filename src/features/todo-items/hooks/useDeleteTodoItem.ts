import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoItemsApi } from '../../../api/todoItems'

type DeleteTodoItemInput = {
  listId: number
  itemId: number
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, itemId }: DeleteTodoItemInput) =>
      todoItemsApi.delete(listId, itemId),

    onMutate: async ({ listId, itemId }) => {
      await queryClient.cancelQueries({ queryKey: ['todoitems', listId] })

      const previous = queryClient.getQueryData(['todoitems', listId])

      queryClient.setQueryData(['todoitems', listId], (old: any[] = []) =>
        old.filter((item) => item.id !== itemId)
      )

      return { previous }
    },

    onError: (_err, variables, context) => {
      queryClient.setQueryData(['todoitems', variables.listId], context?.previous)
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['todoitems', variables.listId],
      })
    },
  })
}
