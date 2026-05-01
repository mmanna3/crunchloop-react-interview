import { http, HttpResponse } from 'msw'

const BASE_URL = 'https://localhost:7027'

export const handlers = [
  http.get(`${BASE_URL}/api/todolists`, () =>
    HttpResponse.json([
      { id: 1, name: 'List 1' },
      { id: 2, name: 'List 2' },
    ])
  ),
  http.get(`${BASE_URL}/api/todolists/:listId`, ({ params }) => {
    const id = Number(params.listId)
    const lists: Record<number, { id: number; name: string }> = {
      1: { id: 1, name: 'List 1' },
      2: { id: 2, name: 'List 2' },
    }
    const list = lists[id]
    if (!list) return HttpResponse.json(null, { status: 404 })
    return HttpResponse.json(list)
  }),
  http.get(`${BASE_URL}/api/todolists/:listId/items`, ({ params }) => {
    const id = Number(params.listId)
    if (id === 1) {
      return HttpResponse.json([
        { id: 10, description: 'Item list 1', isCompleted: false },
      ])
    }
    if (id === 2) {
      return HttpResponse.json([
        { id: 20, description: 'Item list 2', isCompleted: true },
      ])
    }
    return HttpResponse.json([])
  }),
]
