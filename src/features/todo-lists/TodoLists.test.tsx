import { screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '../../test/server'
import { renderWithProviders } from '../../test/renderWithProviders'
import { TodoLists } from './TodoLists'

describe('TodoLists', () => {
  it('renderiza las listas recibidas del servidor', async () => {
    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByText('Lista 1')).toBeInTheDocument()
      expect(screen.getByText('Lista 2')).toBeInTheDocument()
    })
  })

  it('muestra error cuando el servidor falla', async () => {
    server.use(
      http.get('https://localhost:7027/api/todolists', () =>
        HttpResponse.json(null, { status: 500 })
      )
    )

    renderWithProviders(<TodoLists />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
