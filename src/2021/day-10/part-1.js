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
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

export default function (blob) {
  let navigation = blob.trim().split('\n')

  let total = 0
  for (let nav of navigation) {
    let { valid, expected } = validate(nav)
    if (!valid) total += points[expected]
  }

  return total
}

function validate(input) {
  let stack = []
  for (let char of input) {
    if (matchingBrackets.has(char)) {
      stack.push(char)
    } else if (inverseMatchingBrackets.has(char)) {
      if (stack.length <= 0 || stack.pop() !== inverseMatchingBrackets.get(char)) {
        return { valid: false, expected: char }
      }
    }
  }

  // If stack is not empty, there are unmatched brackets, which is fine for this puzzle

  return { valid: true }
}
