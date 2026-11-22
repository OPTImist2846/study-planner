import { useState, type CSSProperties } from 'react'
import { useTaskContext } from '../../hooks/useTaskContext'
import type { Task } from '../../types/task'
import { PRIORITY_LABELS, categoryHue, getCategories } from '../../utils/tasks'
import Button from '../Button/Button'
import TaskForm from '../TaskForm/TaskForm'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
  pendingKey: string | null
}

function TaskItem({ task, pendingKey }: TaskItemProps) {
  const { tasks, toggleTask, updateTask, requestDelete, undoDelete } = useTaskContext()
  const [isEditing, setIsEditing] = useState(false)
  const isPending = pendingKey !== null

  if (isEditing && !isPending) {
    const { title, description, category, priority } = task
    return (
      <li className="task-item task-item--editing">
        <TaskForm
          categories={getCategories(tasks)}
          initial={{ title, description, category, priority }}
          onSubmit={(changes) => {
            updateTask(task.id, changes)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    )
  }

  const classes = [
    'task-item',
    task.completed && 'task-item--completed',
    isPending && 'task-item--pending',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <li className={classes}>
      <input
        type="checkbox"
        className="task-item__checkbox"
        checked={task.completed}
        disabled={isPending}
        aria-label={`Позначити «${task.title}» як виконане`}
        onChange={() => toggleTask(task.id)}
      />
      <div className="task-item__body">
        <h3 className="task-item__title">{task.title}</h3>
        {task.description && <p className="task-item__description">{task.description}</p>}
        <div className="task-item__meta">
          <span
            className="task-item__category"
            style={{ '--category-hue': categoryHue(task.category) } as CSSProperties}
          >
            {task.category}
          </span>
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className="task-item__status">
            {isPending ? 'Буде видалено' : task.completed ? 'Виконано' : 'Не виконано'}
          </span>
        </div>
      </div>
      <div className="task-item__actions">
        {isPending ? (
          <Button size="small" variant="primary" onClick={() => undoDelete(pendingKey)}>
            Скасувати
          </Button>
        ) : (
          <>
            <Button
              size="small"
              variant={task.completed ? 'secondary' : 'primary'}
              onClick={() => toggleTask(task.id)}
            >
              {task.completed ? 'Повернути' : 'Виконано'}
            </Button>
            <Button size="small" variant="secondary" onClick={() => setIsEditing(true)}>
              Редагувати
            </Button>
            <Button
              size="small"
              variant="danger"
              aria-label={`Видалити «${task.title}»`}
              onClick={() => requestDelete(task.id)}
            >
              Видалити
            </Button>
          </>
        )}
      </div>
    </li>
  )
}

export default TaskItem
