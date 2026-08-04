import { useEffect, useRef, useState } from 'react'
import { Task } from '../models/Task'
import {
  CATEGORIES,
  getLocalDateValue,
  validateDate,
  validateTaskFields,
  validateTime,
  validateTitle,
} from '../utils/taskValidation'

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [titleTouched, setTitleTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const titleInputRef = useRef(null)

  const titleValidation = validateTitle(title)
  const dateValidation = validateDate(date)
  const timeValidation = validateTime(date, time)

  useEffect(() => {
    titleInputRef.current?.focus()
  }, [])

  const clearForm = () => {
    setTitle('')
    setDescription('')
    setDate('')
    setTime('')
    setCategory(CATEGORIES[0])
    setTitleTouched(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    let taskAdded = false
    setSubmitting(true)

    try {
      const fields = { title, description, date, time, category }
      validateTaskFields(fields)

      const task = new Task(
        globalThis.crypto?.randomUUID?.() ?? String(Date.now()),
        title.trim(),
        description.trim(),
        date,
        time,
        category,
      )

      task.setTitle(title)
      onAddTask(task)
      clearForm()
      taskAdded = true
    } catch (error) {
      alert(`Unable to add task: ${error.message}`)
    } finally {
      setSubmitting(false)

      if (taskAdded) {
        requestAnimationFrame(() => titleInputRef.current?.focus())
      }
    }
  }

  const handleKeyDown = (event) => {
    if (
      event.key === 'Enter' &&
      event.target.tagName !== 'TEXTAREA' &&
      event.target.tagName !== 'BUTTON'
    ) {
      event.preventDefault()
      event.currentTarget.requestSubmit()
    }
  }

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <div className="form-heading">
        <div>
          <p className="eyebrow">New task</p>
          <h2>What needs your attention?</h2>
        </div>
        <span>All fields are required</span>
      </div>

      <div className="form-grid">
        <div className="field-group field-wide">
          <label htmlFor="task-title">Title</label>
          <input
            ref={titleInputRef}
            id="task-title"
            type="text"
            value={title}
            maxLength="60"
            placeholder="Prepare project presentation"
            aria-describedby="title-feedback"
            aria-invalid={titleTouched && !titleValidation.isValid}
            onBlur={() => setTitleTouched(true)}
            onChange={(event) => {
              setTitle(event.target.value)
              setTitleTouched(true)
            }}
          />
          <p
            id="title-feedback"
            className={`field-feedback ${
              titleTouched
                ? titleValidation.isValid
                  ? 'is-valid'
                  : 'is-invalid'
                : ''
            }`}
          >
            {titleTouched
              ? titleValidation.message
              : 'Use 3-60 letters, numbers, spaces, apostrophes, or hyphens.'}
          </p>
        </div>

        <div className="field-group field-wide">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            rows="4"
            maxLength="320"
            placeholder="Add the details you will need when it is time to begin."
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="field-group">
          <label htmlFor="task-date">Date</label>
          <input
            id="task-date"
            type="date"
            min={getLocalDateValue()}
            value={date}
            aria-invalid={Boolean(date && !dateValidation.isValid)}
            onChange={(event) => setDate(event.target.value)}
          />
          {date && !dateValidation.isValid && (
            <p className="field-feedback is-invalid">{dateValidation.message}</p>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="task-time">Time</label>
          <input
            id="task-time"
            type="time"
            value={time}
            aria-invalid={Boolean(time && !timeValidation.isValid)}
            onChange={(event) => setTime(event.target.value)}
          />
          {time && !timeValidation.isValid && (
            <p className="field-feedback is-invalid">{timeValidation.message}</p>
          )}
        </div>

        <div className="field-group">
          <label htmlFor="task-category">Category</label>
          <select
            id="task-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="primary-button submit-task-button" type="submit">
        {submitting ? 'Adding task...' : 'Add task'}
        <span aria-hidden="true">+</span>
      </button>
    </form>
  )
}

export default TaskForm
