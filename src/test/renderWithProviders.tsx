import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { createQueryClient } from '../lib/react-query'

export function renderWithProviders(
  ui: React.ReactElement,
  initialEntries: NonNullable<
    React.ComponentProps<typeof MemoryRouter>['initialEntries']
  > = ['/']
) {
  const queryClient = createQueryClient()
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </MemoryRouter>
  )
}
