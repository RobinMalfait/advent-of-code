// Day 4: Secure Container

const { range } = require('../utils')

function isValidPassword(password) {
  const parts = `${password || ''}`.split('').map(Number)

  // Verify doubles
  if (!parts.some((part, index) => parts[index - 1] === part)) {
    return false
  }

  // Verify increasing values
  return parts.every((part, index) => (parts[index - 1] || Number.NEGATIVE_INFINITY) <= part)
}

function countValidPasswordsBetween(start, end) {
  const _start = Number(start)
  const _end = Number(end)

  return range(_end - _start).reduce(
    (total, current) => total + (isValidPassword(_start + current) ? 1 : 0),
    0
  )
}

module.exports = { isValidPassword, countValidPasswordsBetween }
