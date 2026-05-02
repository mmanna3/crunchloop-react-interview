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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        className="field flex-1"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        aria-label="Task description"
      />
      <div className="flex shrink-0 gap-2">
        <button type="button" className="btn-primary" onClick={onSave} disabled={isSaving}>
          Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
