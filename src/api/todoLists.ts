import { components } from './types'
import { fetcher, fetcherVoid } from './client'

type TodoList = components['schemas']['TodoList']
type CreateListDTO = components['schemas']['CreateListDTO']
type UpdateListDTO = components['schemas']['UpdateListDTO']

export const todoListsApi = {
  getAll: () =>
    fetcher<TodoList[]>('/api/todolists'),

  getById: (id: number) =>
    fetcher<TodoList>(`/api/todolists/${id}`),

  create: (data: CreateListDTO) =>
    fetcher<TodoList>('/api/todolists', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: UpdateListDTO) =>
    fetcherVoid(`/api/todolists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: number) =>
    fetcherVoid(`/api/todolists/${id}`, { method: 'DELETE' }),
}
