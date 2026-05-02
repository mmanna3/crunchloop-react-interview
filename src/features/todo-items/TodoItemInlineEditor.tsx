type TodoItemInlineEditorProps = {
  description: string
  onDescriptionChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}

export function TodoItemInlineEditor({
  description,
  onDescriptionChange,
  onSave,
  onCancel,
  isSaving,
}: TodoItemInlineEditorProps) {
  return (
    <>
      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      <button type="button" onClick={onSave} disabled={isSaving}>
        Save
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </>
  )
}
