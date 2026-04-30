import { components } from './types'
import { fetcher, fetcherVoid } from './client'

type TodoItemDTO = components['schemas']['TodoItemDTO']
type CreateItemDTO = components['schemas']['CreateItemDTO']
type UpdateItemDTO = components['schemas']['UpdateItemDTO']

export const todoItemsApi = {
  getAll: (listId: number) =>
    fetcher<TodoItemDTO[]>(`/api/todolists/${listId}/items`),

  getById: (listId: number, id: number) =>
    fetcher<TodoItemDTO>(`/api/todolists/${listId}/items/${id}`),

  create: (listId: number, data: CreateItemDTO) =>
    fetcher<TodoItemDTO>(`/api/todolists/${listId}/items`, { method: 'POST', body: JSON.stringify(data) }),

  update: (listId: number, id: number, data: UpdateItemDTO) =>
    fetcherVoid(`/api/todolists/${listId}/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (listId: number, id: number) =>
    fetcherVoid(`/api/todolists/${listId}/items/${id}`, { method: 'DELETE' }),
}
