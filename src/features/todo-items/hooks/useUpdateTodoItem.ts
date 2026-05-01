import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todoItemsApi } from '../../../api/todoItems'

type UpdateTodoItemInput = {
  listId: number
  itemId: number
  description: string
}

export function useUpdateTodoItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ listId, itemId, description }: UpdateTodoItemInput) => {
      const items = queryClient.getQueryData<any[]>(['todoitems', listId]) || []
      const currentItem = items.find((item) => item.id === itemId)

      if (!currentItem) {
        throw new Error('Item not found in cache')
      }

      return todoItemsApi.update(listId, itemId, {
        description,
        isCompleted: currentItem.isCompleted,
      })
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['todoitems', variables.listId],
      })
    },
  })
}
