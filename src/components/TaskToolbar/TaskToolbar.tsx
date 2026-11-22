import { useId } from 'react'
import { useTaskContext } from '../../hooks/useTaskContext'
import Button from '../Button/Button'
import './TaskToolbar.scss'

function TaskToolbar() {
  const {
    tasks,
    pendingKeyByTask,
    search,
    setSearch: onSearchChange,
    prioritySort: sortByPriority,
    setPrioritySort: onSortChange,
    clearCompleted: onClearCompleted,
    resetTasks,
  } = useTaskContext()
  const completedCount = tasks.filter(
    (task) => task.completed && !pendingKeyByTask.has(task.id),
  ).length
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
      <Button size="small" variant="ghost" onClick={resetTasks}>
        Скинути дані
      </Button>
    </div>
  )
}

export default TaskToolbar
