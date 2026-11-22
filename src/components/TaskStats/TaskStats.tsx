import { useTaskContext } from '../../hooks/useTaskContext'
import { countTasks } from '../../utils/tasks'
import './TaskStats.scss'

function TaskStats() {
  const { tasks, pendingKeyByTask } = useTaskContext()
  const { total, completed, active } = countTasks(
    tasks.filter((task) => !pendingKeyByTask.has(task.id)),
  )
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)

  const items = [
    { key: 'total', label: 'Всього', value: total },
    { key: 'completed', label: 'Виконано', value: completed },
    { key: 'active', label: 'Не виконано', value: active },
  ]

  return (
    <section className="task-stats" aria-label="Статистика">
      <dl className="task-stats__list">
        {items.map((item) => (
          <div key={item.key} className={`task-stats__item task-stats__item--${item.key}`}>
            <dt className="task-stats__label">{item.label}</dt>
            <dd className="task-stats__value">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div
        className="task-stats__progress"
        role="progressbar"
        aria-label="Прогрес виконання"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="task-stats__progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="task-stats__caption">Виконано {progress}%</p>
    </section>
  )
}

export default TaskStats
