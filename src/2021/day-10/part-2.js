let matchingBrackets = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
])
let inverseMatchingBrackets = new Map([
  [')', '('],
  [']', '['],
  ['}', '{'],
  ['>', '<'],
])

let points = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

export default function (blob) {
  let navigation = blob.trim().split('\n')

  let totals = []
  for (let nav of navigation) {
    let { status, missing } = validate(nav)
    if (status === 'incomplete') {
      let total = 0
      for (let char of missing) {
        total *= 5
        total += points[char]
      }
      totals.push(total)
    }
  }

  return totals.sort((a, z) => a - z)[(totals.length / 2) | 0]
}

function validate(line) {
  let stack = []
  for (let char of line) {
    if (matchingBrackets.has(char)) {
      stack.push(char)
    } else if (inverseMatchingBrackets.has(char)) {
      if (stack.length <= 0 || stack.pop() !== inverseMatchingBrackets.get(char)) {
        return { status: 'invalid', expected: char }
      }
    }
  }

  // Valid line so far, but incomplete
  if (stack.length > 0) {
    return {
      status: 'incomplete',
      missing: stack.reverse().map((char) => matchingBrackets.get(char)),
    }
  }

  return { status: 'valid' }
}
