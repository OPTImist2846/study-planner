import type { Task } from '../../types/task'
import type { CSSProperties } from 'react'
import { PRIORITY_LABELS, categoryHue } from '../../utils/tasks'
import Button from '../Button/Button'
import './TaskItem.scss'

interface TaskItemProps {
  task: Task
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li className={`task-item${task.completed ? ' task-item--completed' : ''}`}>
      <input
        type="checkbox"
        className="task-item__checkbox"
        checked={task.completed}
        aria-label={`Позначити «${task.title}» як виконане`}
        onChange={() => onToggle(task.id)}
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
          <span className="task-item__status">{task.completed ? 'Виконано' : 'Не виконано'}</span>
        </div>
      </div>
      <div className="task-item__actions">
        <Button
          size="small"
          variant={task.completed ? 'secondary' : 'primary'}
          onClick={() => onToggle(task.id)}
        >
          {task.completed ? 'Повернути' : 'Виконано'}
        </Button>
        <Button
          size="small"
          variant="danger"
          aria-label={`Видалити «${task.title}»`}
          onClick={() => onDelete(task.id)}
        >
          Видалити
        </Button>
      </div>
    </li>
  )
}

export default TaskItem
