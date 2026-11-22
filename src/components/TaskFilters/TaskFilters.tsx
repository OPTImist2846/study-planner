import { useTaskContext } from '../../hooks/useTaskContext'
import { FILTERS, FILTER_LABELS, countTasks } from '../../utils/tasks'
import Button from '../Button/Button'
import './TaskFilters.scss'

function TaskFilters() {
  const { tasks, pendingKeyByTask, filter: value, setFilter: onChange } = useTaskContext()
  const { total, completed, active } = countTasks(
    tasks.filter((task) => !pendingKeyByTask.has(task.id)),
  )
  const counts = { all: total, completed, active }

  return (
    <div className="task-filters" role="group" aria-label="Фільтр завдань">
      {FILTERS.map((filter) => (
        <Button
          key={filter}
          size="small"
          active={filter === value}
          aria-pressed={filter === value}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABELS[filter]}
          <span className="task-filters__count">{counts[filter]}</span>
        </Button>
      ))}
    </div>
  )
}

export default TaskFilters
