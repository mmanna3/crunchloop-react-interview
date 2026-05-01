import { useMutation } from "@tanstack/react-query"
import { useQueryClient } from "@tanstack/react-query"
import { todoListsApi } from "../../../api/todoLists"

export function useDeleteTodoList() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: todoListsApi.delete,

        onMutate: async (id: number) => {
            await queryClient.cancelQueries({ queryKey: ['todolists'] })

            const previous = queryClient.getQueryData(['todolists'])

            queryClient.setQueryData(['todolists'], (old: any[] = []) =>
                old.filter((list) => list.id !== id)
            )

            return { previous }
        },

        onError: (_err, _id, context) => {
            queryClient.setQueryData(['todolists'], context?.previous)
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['todolists'] })
        },
    })
}