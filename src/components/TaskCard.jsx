import { memo, useEffect, useState } from 'react'
import { Task } from '../models/Task'
import {
  CATEGORIES,
  getLocalDateValue,
  validateDate,
  validateTaskFields,
  validateTime,
  validateTitle,
} from '../utils/taskValidation'

const getStatus = (task, currentTime) => {
  const taskDateTime = new Date(`${task.date}T${task.time}:00`)
  const today = getLocalDateValue(currentTime)

  if (taskDateTime.getTime() < currentTime.getTime()) {
    return { key: 'overdue', label: 'Overdue' }
  }

  if (task.date === today) {
    return { key: 'today', label: 'Due today' }
  }

  return { key: 'upcoming', label: 'Upcoming' }
}

const getFormattedTime = (time) => {
  const [hours, minutes] = time.split(':')
  const value = new Date()
  value.setHours(Number(hours), Number(minutes), 0, 0)

  return new Intl.DateTimeFormat(navigator.language, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(value)
}

function TaskCard({ task, currentTime, onUpdateTask }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editFields, setEditFields] = useState({
    title: task.title,
    description: task.description,
    date: task.date,
    time: task.time,
    category: task.category,
  })

  useEffect(() => {
    if (!isEditing) {
      setEditFields({
        title: task.title,
        description: task.description,
        date: task.date,
        time: task.time,
        category: task.category,
      })
    }
  }, [isEditing, task])

  const titleValidation = validateTitle(editFields.title)
  const dateValidation = validateDate(editFields.date)
  const timeValidation = validateTime(editFields.date, editFields.time)

  const startEditing = () => {
    setEditFields({
      title: task.title,
      description: task.description,
      date: task.date,
      time: task.time,
      category: task.category,
    })
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setEditFields({
      title: task.title,
      description: task.description,
      date: task.date,
      time: task.time,
      category: task.category,
    })
    setIsEditing(false)
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target

    setEditFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }))
  }

  const handleEditKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelEditing()
    }
  }

  const saveEdit = (event) => {
    event.preventDefault()

    try {
      validateTaskFields(editFields)
      const updatedTask = new Task(
        task.id,
        editFields.title.trim(),
        editFields.description.trim(),
        editFields.date,
        editFields.time,
        editFields.category,
      )

      updatedTask.setTitle(editFields.title)
      onUpdateTask(updatedTask)
      setIsEditing(false)
    } catch (error) {
      alert(`Unable to update task: ${error.message}`)
    }
  }

  if (isEditing) {
    return (
      <article className="task-card task-card-editing">
        <form onSubmit={saveEdit} onKeyDown={handleEditKeyDown} noValidate>
          <div className="edit-grid">
            <div className="field-group field-wide">
              <label htmlFor={`edit-title-${task.id}`}>Title</label>
              <input
                id={`edit-title-${task.id}`}
                name="title"
                value={editFields.title}
                maxLength="60"
                autoFocus
                aria-invalid={!titleValidation.isValid}
                onChange={handleFieldChange}
              />
              <p
                className={`field-feedback ${
                  titleValidation.isValid ? 'is-valid' : 'is-invalid'
                }`}
              >
                {titleValidation.message}
              </p>
            </div>

            <div className="field-group field-wide">
              <label htmlFor={`edit-description-${task.id}`}>
                Description
              </label>
              <textarea
                id={`edit-description-${task.id}`}
                name="description"
                value={editFields.description}
                rows="3"
                maxLength="320"
                onChange={handleFieldChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor={`edit-date-${task.id}`}>Date</label>
              <input
                id={`edit-date-${task.id}`}
                name="date"
                type="date"
                min={getLocalDateValue()}
                value={editFields.date}
                aria-invalid={!dateValidation.isValid}
                onChange={handleFieldChange}
              />
              {!dateValidation.isValid && (
                <p className="field-feedback is-invalid">
                  {dateValidation.message}
                </p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor={`edit-time-${task.id}`}>Time</label>
              <input
                id={`edit-time-${task.id}`}
                name="time"
                type="time"
                value={editFields.time}
                aria-invalid={!timeValidation.isValid}
                onChange={handleFieldChange}
              />
              {!timeValidation.isValid && (
                <p className="field-feedback is-invalid">
                  {timeValidation.message}
                </p>
              )}
            </div>

            <div className="field-group">
              <label htmlFor={`edit-category-${task.id}`}>Category</label>
              <select
                id={`edit-category-${task.id}`}
                name="category"
                value={editFields.category}
                onChange={handleFieldChange}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card-actions">
            <button className="card-button save-button" type="submit">
              Save changes
            </button>
            <button
              className="card-button"
              type="button"
              onClick={cancelEditing}
            >
              Cancel
            </button>
            <span className="escape-hint">Esc to cancel</span>
          </div>
        </form>
      </article>
    )
  }

  const status = getStatus(task, currentTime)

  return (
    <article className={`task-card task-status-${status.key}`}>
      <div className="task-card-topline">
        <span className={`category-badge category-${task.category.toLowerCase()}`}>
          {task.category}
        </span>
        <span className={`status-badge status-${status.key}`}>
          {status.label}
        </span>
      </div>

      <div className="task-card-copy">
        <h3 title={task.title}>{task.title}</h3>
        <p title={task.description}>{task.description}</p>
      </div>

      <div className="task-schedule">
        <span>{task.getFormattedDate()}</span>
        <strong>{getFormattedTime(task.time)}</strong>
      </div>

      <div className="card-actions">
        <button className="card-button" type="button" onClick={startEditing}>
          Edit
        </button>
        <button
          className="card-button delete-button"
          type="button"
          data-action="delete-task"
          data-task-id={task.id}
          data-task-title={task.title}
        >
          Delete
        </button>
      </div>
    </article>
  )
}

export default memo(TaskCard)
