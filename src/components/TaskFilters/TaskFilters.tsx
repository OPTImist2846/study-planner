import type { TaskFilter } from '../../types/task'
import { FILTERS, FILTER_LABELS } from '../../utils/tasks'
import Button from '../Button/Button'
import './TaskFilters.scss'

interface TaskFiltersProps {
  value: TaskFilter
  counts: Record<TaskFilter, number>
  onChange: (filter: TaskFilter) => void
}

function TaskFilters({ value, counts, onChange }: TaskFiltersProps) {
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
