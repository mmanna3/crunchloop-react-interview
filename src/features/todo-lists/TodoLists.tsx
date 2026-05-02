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

  if (isLoading) {
    return (
      <p className="text-center text-sm text-zinc-500">Cargando...</p>
    )
  }

  if (error) {
    return (
      <p className="rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-center text-sm text-red-800">
        Error al cargar las listas.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <AddTodoListForm />
      <TodoListDisplay
        lists={data ?? []}
        editingId={editingId}
        onStartEdit={handleStartEdit}
        onCancelEdit={() => setEditingId(null)}
        onEditSaved={() => setEditingId(null)}
      />
    </div>
  )
}
