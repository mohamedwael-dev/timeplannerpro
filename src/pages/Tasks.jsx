import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import {
  loadTasks,
  saveTasks,
  TASKS_STORAGE_KEY,
} from '../utils/taskStorage'
import {
  CATEGORIES,
  getLocalDateValue,
  getLocalTimeValue,
} from '../utils/taskValidation'

function getInitialTasks() {
  try {
    return loadTasks()
  } catch {
    return []
  }
}

function getLayoutMode(width) {
  if (width < 720) {
    return 'compact'
  }

  if (width < 1000) {
    return 'medium'
  }

  return 'wide'
}

function Tasks() {
  const [tasks, setTasks] = useState(getInitialTasks)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [successMessage, setSuccessMessage] = useState('')
  const [currentTime, setCurrentTime] = useState(() => new Date())
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth)
  const reminderIntervalRef = useRef(null)
  const successTimeoutRef = useRef(null)
  const remindedTasksRef = useRef(new Set())

  useEffect(() => {
    // localStorage is used instead of sessionStorage because the user's task
    // plan must survive browser restarts and remain available across tabs.
    saveTasks(tasks)
  }, [tasks])

  useEffect(() => {
    const syncTasksAcrossTabs = (event) => {
      if (event.key !== TASKS_STORAGE_KEY) {
        return
      }

      try {
        setTasks(loadTasks())
      } catch {
        setTasks([])
      }
    }

    window.addEventListener('storage', syncTasksAcrossTabs)

    return () => {
      window.removeEventListener('storage', syncTasksAcrossTabs)
    }
  }, [])

  useEffect(() => {
    const checkDueTasks = () => {
      const now = new Date()
      const currentDate = getLocalDateValue(now)
      const currentMinute = getLocalTimeValue(now)

      setCurrentTime(now)

      tasks.forEach((task) => {
        const reminderKey = `${task.id}|${task.date}|${task.time}`
        const isDueNow =
          task.date === currentDate &&
          task.time === currentMinute &&
          !remindedTasksRef.current.has(reminderKey)

        if (isDueNow) {
          remindedTasksRef.current.add(reminderKey)
          alert(`Task reminder: "${task.title}" is due now.`)
        }
      })
    }

    reminderIntervalRef.current = window.setInterval(checkDueTasks, 30000)

    return () => {
      window.clearInterval(reminderIntervalRef.current)
    }
  }, [tasks])

  useEffect(() => {
    const updateWindowWidth = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', updateWindowWidth)

    return () => {
      window.removeEventListener('resize', updateWindowWidth)
    }
  }, [])

  useEffect(
    () => () => {
      window.clearTimeout(successTimeoutRef.current)
    },
    [],
  )

  const categoryCounts = tasks.reduce(
    (counts, task) => ({
      ...counts,
      [task.category]: (counts[task.category] ?? 0) + 1,
    }),
    CATEGORIES.reduce(
      (counts, category) => ({ ...counts, [category]: 0 }),
      {},
    ),
  )

  const visibleTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          selectedCategory === 'All' || task.category === selectedCategory,
      ),
    [selectedCategory, tasks],
  )

  const addTask = useCallback((task) => {
    setTasks((currentTasks) => [task, ...currentTasks])
    setSuccessMessage(`"${task.title}" was added successfully.`)

    window.clearTimeout(successTimeoutRef.current)
    successTimeoutRef.current = window.setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }, [])

  const updateTask = useCallback((updatedTask) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    )
  }, [])

  const deleteTask = useCallback((taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== taskId),
    )
  }, [])

  const handleTaskListClick = useCallback(
    (event) => {
      const deleteButton = event.target.closest('[data-action="delete-task"]')

      if (!deleteButton || !event.currentTarget.contains(deleteButton)) {
        return
      }

      const { taskId, taskTitle } = deleteButton.dataset
      const confirmed = confirm(
        `Delete "${taskTitle}"? This task will be permanently removed.`,
      )

      if (confirmed) {
        deleteTask(taskId)
      }
    },
    [deleteTask],
  )

  const layoutMode = getLayoutMode(windowWidth)

  return (
    <section className="tasks-page">
      <div className="container">
        <div className="tasks-page-heading">
          <div>
            <p className="eyebrow">Your workspace</p>
            <h1 className="page-title">Plan what comes next.</h1>
          </div>
          <p>
            Add focused tasks, organize them by category, and keep your next
            commitment visible.
          </p>
        </div>

        {successMessage && (
          <div className="success-notification" role="status" aria-live="polite">
            <span aria-hidden="true">✓</span>
            {successMessage}
          </div>
        )}

        <TaskForm onAddTask={addTask} />

        <section className="task-list-section" aria-labelledby="task-list-title">
          <div className="task-list-toolbar">
            <div>
              <p className="eyebrow">Your plan</p>
              <h2 id="task-list-title">Upcoming tasks</h2>
            </div>

            <div className="filter-control">
              <label htmlFor="category-filter">Filter category</label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="All">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="category-statistics" aria-label="Task statistics">
            <div>
              <span>All</span>
              <strong>{tasks.length}</strong>
            </div>
            {CATEGORIES.map((category) => (
              <div key={category}>
                <span>{category}</span>
                <strong>{categoryCounts[category]}</strong>
              </div>
            ))}
          </div>

          <div
            className="task-list-content"
            onClick={handleTaskListClick}
            data-layout={layoutMode}
            data-window-width={windowWidth}
          >
            {visibleTasks.length > 0 ? (
              <div className={`task-grid task-grid-${layoutMode}`}>
                {visibleTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    currentTime={currentTime}
                    onUpdateTask={updateTask}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon" aria-hidden="true">
                  <span />
                </div>
                <h2>No tasks yet</h2>
                <p>
                  {tasks.length === 0
                    ? 'Add your first task using the form above.'
                    : `No ${selectedCategory.toLowerCase()} tasks match this filter.`}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </section>
  )
}

export default Tasks
