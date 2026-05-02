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
      <div className="inline-flex items-center gap-2 rounded-full border border-accent-border bg-accent-soft px-4 py-2 text-sm font-medium text-orange-950">
        <span
          className="inline-block size-2 animate-pulse rounded-full bg-accent"
          aria-hidden
        />
        Completing... {progress.completed} / {progress.total}
      </div>
    )
  }

  return (
    <button type="button" className="btn-primary w-full sm:w-auto" onClick={handleCompleteAll}>
      Complete all items
    </button>
  )
}
