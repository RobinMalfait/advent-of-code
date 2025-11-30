// Day 4: Secure Container

import { range } from '../utils'

function isValidPassword(password) {
  let parts = `${password || ''}`.split('').map(Number)

  // Verify doubles
  // if (!parts.some((part, index) => parts[index - 1] === part)) {
  //   return false;
  // }

  // Verify increasing values
  if (!parts.every((part, index) => (parts[index - 1] || Number.NEGATIVE_INFINITY) <= part)) {
    return false
  }

  // Group the consecutive values of the same digit in the same group. If you
  // read this code.... look, it was late at night, okay?!
  // Maps [1,1,1,2,2] -> ['111', '22']
  let groups = parts.reduce((groups, value) => {
    let last = groups[groups.length - 1] || ''

    //
    if (last === '') {
      return [`${value}`]
    }

    if (last.includes(value)) {
      return [...groups.slice(0, groups.length - 1), `${last}${value}`]
    }

    groups.push(`${value}`)
    return groups
  }, [])

  // Verify that there is a group of at most length 2 of the same digits.
  return groups.some((group) => group.length === 2)
}

function countValidPasswordsBetween(start, end) {
  let _start = Number(start)
  let _end = Number(end)

  return range(_end - _start).reduce(
    (total, current) => total + (isValidPassword(_start + current) ? 1 : 0),
    0,
  )
}

export default { isValidPassword, countValidPasswordsBetween }
