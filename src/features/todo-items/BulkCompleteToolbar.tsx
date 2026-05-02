import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { components } from '../../api/types'
import { todoListsApi } from '../../api/todoLists'
import { useBulkCompleteListener } from './hooks/useBulkCompleteListener'

type TodoItemDTO = components['schemas']['TodoItemDTO']

type BulkCompleteToolbarProps = {
  listId: number
}

export function BulkCompleteToolbar({ listId }: BulkCompleteToolbarProps) {
  const queryClient = useQueryClient()
  const { connect, progress } = useBulkCompleteListener()

  useEffect(() => {
    if (!progress || progress.completedIds.length === 0) return
    const completedSet = new Set(progress.completedIds)
    queryClient.setQueryData(['todoitems', listId], (old: TodoItemDTO[] | undefined) =>
      old?.map((item) =>
        completedSet.has(item.id!) ? { ...item, isCompleted: true } : item
      )
    )
  }, [progress, listId, queryClient])

  async function handleCompleteAll() {
    const connectionId = await connect()
    await todoListsApi.completeAllItems(listId, connectionId)
  }

  if (progress && !progress.isFinished) {
    return (
      <span>
        Completing... {progress.completed} / {progress.total}
      </span>
    )
  }

  return (
    <button type="button" onClick={handleCompleteAll}>
      Complete all items
    </button>
  )
}
