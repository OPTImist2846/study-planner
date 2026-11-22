import type { Task } from '../../types/task'
import TaskItem from '../TaskItem/TaskItem'
import './TaskList.scss'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}

function TaskList({ tasks, onToggle, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="task-list__empty" role="status">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p className="task-list__empty-text">Додайте перше навчальне завдання.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  )
}

export default TaskList
