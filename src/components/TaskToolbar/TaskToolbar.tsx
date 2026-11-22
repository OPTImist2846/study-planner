import { useId } from 'react'
import Button from '../Button/Button'
import './TaskToolbar.scss'

interface TaskToolbarProps {
  search: string
  sortByPriority: boolean
  completedCount: number
  onSearchChange: (value: string) => void
  onSortChange: (value: boolean) => void
  onClearCompleted: () => void
}

function TaskToolbar({
  search,
  sortByPriority,
  completedCount,
  onSearchChange,
  onSortChange,
  onClearCompleted,
}: TaskToolbarProps) {
  const id = useId()

  return (
    <div className="task-toolbar">
      <label className="visually-hidden" htmlFor={`${id}-search`}>
        Пошук за назвою
      </label>
      <input
        id={`${id}-search`}
        type="search"
        className="task-toolbar__search"
        value={search}
        placeholder="Пошук за назвою"
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <label className="task-toolbar__sort">
        <input
          type="checkbox"
          className="task-toolbar__checkbox"
          checked={sortByPriority}
          onChange={(event) => onSortChange(event.target.checked)}
        />
        За пріоритетом
      </label>
      <Button
        size="small"
        variant="ghost"
        disabled={completedCount === 0}
        onClick={onClearCompleted}
      >
        Очистити виконані
      </Button>
    </div>
  )
}

export default TaskToolbar
