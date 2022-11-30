import { parse, addition, reduce, magnitude, debug } from './solve.js'

export default function (blob) {
  let assignments = blob
    .trim()
    .split('\n')
    .map((assignment) => assignment.trim())

  let max = -Infinity

  for (let lhs of assignments) {
    for (let rhs of assignments) {
      if (lhs === rhs) continue
      max = Math.max(max, magnitude(reduce(addition(parse(lhs), parse(rhs)))))
    }
  }

  return max
}
