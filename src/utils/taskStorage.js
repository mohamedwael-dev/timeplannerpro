import { Task } from '../models/Task.js'

export const TASKS_STORAGE_KEY = 'timePlannerPro.tasks'
const FIELD_SEPARATOR = '|'
const TASK_SEPARATOR = ';'

const encodeField = (value) => encodeURIComponent(String(value))
const decodeField = (value) => decodeURIComponent(value)

export function saveTasks(tasks) {
  const storageString = tasks
    .map((task) =>
      [
        task.id,
        task.title,
        task.description,
        task.date,
        task.time,
        task.category,
      ]
        .map(encodeField)
        .join(FIELD_SEPARATOR),
    )
    .join(TASK_SEPARATOR)

  localStorage.setItem(TASKS_STORAGE_KEY, storageString)
}

export function loadTasks() {
  const storageString = localStorage.getItem(TASKS_STORAGE_KEY)

  if (!storageString) {
    return []
  }

  return storageString
    .split(TASK_SEPARATOR)
    .filter(Boolean)
    .map((storedTask) => {
      const [id, title, description, date, time, category] = storedTask
        .split(FIELD_SEPARATOR)
        .map(decodeField)

      return new Task(id, title, description, date, time, category)
    })
}
