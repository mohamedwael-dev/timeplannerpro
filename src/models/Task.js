// oxlint-disable react/no-this-in-sfc
export const TITLE_PATTERN = /^(?=.*[A-Za-z0-9])[A-Za-z0-9][A-Za-z0-9 '-]{2,59}$/

export const TITLE_ERROR =
  'Title must be 3-60 characters and contain only letters, numbers, spaces, apostrophes, or hyphens.'

export function Task(id, title, description, date, time, category) {
  this.id = id
  this.title = title
  this.description = description
  this.date = date
  this.time = time
  this.category = category
}

Task.prototype.getFormattedDate = function getFormattedDate() {
  const date = new Date(`${this.date}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date'
  }

  return new Intl.DateTimeFormat(navigator.language, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

Task.prototype.setTitle = function setTitle(title) {
  const cleanTitle = title.trim()

  if (!TITLE_PATTERN.test(cleanTitle)) {
    throw new Error(TITLE_ERROR)
  }

  this.title = cleanTitle
}
