// Day 4: Secure Container

import { range } from '../utils'

function isValidPassword(password) {
  let parts = `${password || ''}`.split('').map(Number)

  // Verify doubles
  if (!parts.some((part, index) => parts[index - 1] === part)) {
    return false
  }

  // Verify increasing values
  return parts.every((part, index) => (parts[index - 1] || Number.NEGATIVE_INFINITY) <= part)
}

function countValidPasswordsBetween(start, end) {
  let _start = Number(start)
  let _end = Number(end)

  return range(_end - _start).reduce(
    (total, current) => total + (isValidPassword(_start + current) ? 1 : 0),
    0
  )
}

export default { isValidPassword, countValidPasswordsBetween }
