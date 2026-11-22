import { useId, useState, type FormEvent } from 'react'
import type { TaskDraft, TaskPriority } from '../../types/task'
import { PRIORITIES, PRIORITY_LABELS } from '../../utils/tasks'
import Button from '../Button/Button'
import './TaskForm.scss'

interface TaskFormProps {
  categories: string[]
  onSubmit: (draft: TaskDraft) => void
}

const EMPTY_DRAFT: TaskDraft = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
}

const DEFAULT_CATEGORY = 'Загальне'

function TaskForm({ categories, onSubmit }: TaskFormProps) {
  const [draft, setDraft] = useState<TaskDraft>(EMPTY_DRAFT)
  const [error, setError] = useState<string | null>(null)
  const id = useId()

  function updateField<K extends keyof TaskDraft>(field: K, value: TaskDraft[K]) {
    setDraft((previous) => ({ ...previous, [field]: value }))
    if (field === 'title') setError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.title.trim()
    if (!title) {
      setError('Введіть назву завдання.')
      return
    }
    onSubmit({
      title,
      description: draft.description.trim(),
      category: draft.category.trim() || DEFAULT_CATEGORY,
      priority: draft.priority,
    })
    setDraft(EMPTY_DRAFT)
    setError(null)
  }

  return (
    <form className="task-form" noValidate onSubmit={handleSubmit}>
      <h2 className="task-form__title">Нове завдання</h2>

      <div className="task-form__grid">
        <div className="task-form__field task-form__field--wide">
          <label className="task-form__label" htmlFor={`${id}-title`}>
            Назва <span className="task-form__required">*</span>
          </label>
          <input
            id={`${id}-title`}
            className={`task-form__control${error ? ' task-form__control--invalid' : ''}`}
            value={draft.title}
            placeholder="Наприклад, React Hooks"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => updateField('title', event.target.value)}
          />
          {error && (
            <p id={`${id}-error`} className="task-form__error" role="alert">
              {error}
            </p>
          )}
        </div>

        <div className="task-form__field task-form__field--wide">
          <label className="task-form__label" htmlFor={`${id}-description`}>
            Опис
          </label>
          <textarea
            id={`${id}-description`}
            className="task-form__control task-form__control--textarea"
            value={draft.description}
            rows={2}
            placeholder="Що саме потрібно зробити"
            onChange={(event) => updateField('description', event.target.value)}
          />
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor={`${id}-category`}>
            Категорія
          </label>
          <input
            id={`${id}-category`}
            className="task-form__control"
            value={draft.category}
            list={`${id}-categories`}
            placeholder={DEFAULT_CATEGORY}
            onChange={(event) => updateField('category', event.target.value)}
          />
          <datalist id={`${id}-categories`}>
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div className="task-form__field">
          <label className="task-form__label" htmlFor={`${id}-priority`}>
            Пріоритет
          </label>
          <select
            id={`${id}-priority`}
            className="task-form__control"
            value={draft.priority}
            onChange={(event) => updateField('priority', event.target.value as TaskPriority)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="task-form__actions">
        <Button type="submit" variant="primary">
          Додати
        </Button>
      </div>
    </form>
  )
}

export default TaskForm
