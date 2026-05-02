import { CharacterCount } from '../../components/CharacterCount'
import { TODO_ITEM_DESCRIPTION_MAX_LENGTH } from '../../constants/textLimits'

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
  const canSave =
    description.trim().length > 0 &&
    description.length <= TODO_ITEM_DESCRIPTION_MAX_LENGTH

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
      <div className="min-w-0 flex-1">
        <textarea
          rows={3}
          className="field min-h-22 w-full resize-y py-2.5"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          aria-label="Task description"
        />
        <div className="mt-1 flex justify-end">
          <CharacterCount
            length={description.length}
            max={TODO_ITEM_DESCRIPTION_MAX_LENGTH}
          />
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          className="btn-primary"
          onClick={onSave}
          disabled={isSaving || !canSave}
        >
          Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  )
}
