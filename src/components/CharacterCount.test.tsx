import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CharacterCount } from './CharacterCount'

describe('CharacterCount', () => {
  it('uses neutral styling at or below max', () => {
    const { rerender } = render(<CharacterCount length={0} max={50} />)
    expect(screen.getByText('0/50')).toHaveClass('text-zinc-500')

    rerender(<CharacterCount length={50} max={50} />)
    expect(screen.getByText('50/50')).toHaveClass('text-zinc-500')
  })

  it('uses danger styling when above max', () => {
    render(<CharacterCount length={51} max={50} />)
    expect(screen.getByText('51/50')).toHaveClass('text-red-600')
  })
})
