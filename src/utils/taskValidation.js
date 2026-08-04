import { TITLE_ERROR, TITLE_PATTERN } from '../models/Task.js'

export const CATEGORIES = ['Work', 'Study', 'Personal']

export function getLocalDateValue(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getLocalTimeValue(date = new Date()) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${hours}:${minutes}`
}

export function validateTitle(title) {
  const cleanTitle = title.trim()

  return {
    isValid: TITLE_PATTERN.test(cleanTitle),
    message: TITLE_PATTERN.test(cleanTitle)
      ? 'Title looks good.'
      : TITLE_ERROR,
  }
}

export function validateDate(date) {
  if (!date) {
    return { isValid: false, message: 'Please choose a task date.' }
  }

  if (date < getLocalDateValue()) {
    return {
      isValid: false,
      message: 'Task date cannot be in the past.',
    }
  }

  return { isValid: true, message: '' }
}

export function validateTime(date, time) {
  if (!time) {
    return { isValid: false, message: 'Please choose a task time.' }
  }

  if (date === getLocalDateValue() && time < getLocalTimeValue()) {
    return {
      isValid: false,
      message: 'Task time cannot be in the past when the date is today.',
    }
  }

  return { isValid: true, message: '' }
}

export function validateTaskFields(fields) {
  const titleResult = validateTitle(fields.title)
  const dateResult = validateDate(fields.date)
  const timeResult = validateTime(fields.date, fields.time)

  if (!titleResult.isValid) {
    throw new Error(titleResult.message)
  }

  if (!fields.description.trim()) {
    throw new Error('Description is required.')
  }

  if (!dateResult.isValid) {
    throw new Error(dateResult.message)
  }

  if (!timeResult.isValid) {
    throw new Error(timeResult.message)
  }

  if (!CATEGORIES.includes(fields.category)) {
    throw new Error('Please choose a valid category.')
  }
}
