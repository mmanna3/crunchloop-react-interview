import { Link, useParams } from 'react-router-dom'
import { useTodoItems } from './hooks/useTodoItems'
import { useTodoList } from '../todo-lists/hooks/useTodoList'

export function TodoItems() {
  const { listId: listIdParam } = useParams()
  const listId = Number(listIdParam)

  const isValidId = Number.isFinite(listId)

  const { data: listMeta, isLoading: isLoadingList } = useTodoList(
    listId,
    isValidId
  )

  const {
    data: items,
    isLoading: isLoadingItems,
    error,
  } = useTodoItems(listId)

  if (!isValidId) {
    return <p>Invalid list</p>
  }

  const title = listMeta?.name ?? ''

  return (
    <div>
      <p>
        <Link to="/">← Back</Link>
      </p>

      {isLoadingList ? <p>Loading list...</p> : <h1>{title}</h1>}

      {isLoadingItems && <p>Loading items...</p>}
      {error && <p>Error</p>}

      {!isLoadingItems && !error && items?.length === 0 && (
        <p>No items yet</p>
      )}

      <ul>
        {items?.map((item) => (
          <li key={item.id}>
            {item.description}
            {item.isCompleted ? ' ✓' : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}