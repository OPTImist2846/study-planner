import { useTaskContext } from '../../hooks/useTaskContext'
import { getVisibleTasks } from '../../utils/tasks'
import TaskItem from '../TaskItem/TaskItem'
import './TaskList.scss'

function TaskList() {
  const { tasks: allTasks, filter, search, prioritySort, pendingKeyByTask } = useTaskContext()
  const tasks = getVisibleTasks(allTasks, { filter, search, prioritySort })

  if (allTasks.length === 0) {
    return (
      <div className="task-list__empty" role="status">
        <p className="task-list__empty-title">Завдань поки немає.</p>
        <p className="task-list__empty-text">Додайте перше навчальне завдання.</p>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list__empty" role="status">
        <p className="task-list__empty-title">За цим фільтром завдань немає.</p>
      </div>
    )
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} pendingKey={pendingKeyByTask.get(task.id) ?? null} />
      ))}
    </ul>
  )
}

export default TaskList
