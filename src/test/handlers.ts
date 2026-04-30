import { http, HttpResponse } from 'msw'

const BASE_URL = 'https://localhost:7027'

export const handlers = [
  http.get(`${BASE_URL}/api/todolists`, () =>
    HttpResponse.json([
      { id: 1, name: 'Lista 1' },
      { id: 2, name: 'Lista 2' },
    ])
  ),
]
