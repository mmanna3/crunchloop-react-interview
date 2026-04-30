import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createQueryClient } from '../lib/react-query'

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createQueryClient()
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}
