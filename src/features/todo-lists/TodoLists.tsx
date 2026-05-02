import { useState } from 'react'
import { AddTodoListForm } from './AddTodoListForm'
import { TodoListDisplay } from './TodoListDisplay'
import { useTodoLists } from './hooks/useTodoLists'
import type { TodoList } from '../../api/todoLists'

export function TodoLists() {
  const { data, isLoading, error } = useTodoLists()
  const [editingId, setEditingId] = useState<number | null>(null)

  function handleStartEdit(list: TodoList) {
    setEditingId(list.id!)
  }

  if (isLoading) return <p>Cargando...</p>
  if (error) return <p>Error</p>

  return (
    <>
      <AddTodoListForm />
      <TodoListDisplay
        lists={data ?? []}
        editingId={editingId}
        onStartEdit={handleStartEdit}
        onCancelEdit={() => setEditingId(null)}
        onEditSaved={() => setEditingId(null)}
      />
    </>
  )
}
