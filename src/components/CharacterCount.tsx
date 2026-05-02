type CharacterCountProps = {
  length: number
  max: number
}

export function CharacterCount({ length, max }: CharacterCountProps) {
  const over = length > max
  return (
    <span
      className={`text-xs tabular-nums ${over ? 'font-medium text-red-600' : 'text-zinc-500'}`}
      aria-live="polite"
    >
      {length}/{max}
    </span>
  )
}
