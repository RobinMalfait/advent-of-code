import { addition, magnitude, parse, reduce } from './solve.js'

export default function (blob) {
  return magnitude(
    reduce(
      blob
        .trim()
        .split('\n')
        .map((assignment) => parse(assignment.trim()))
        .reduce((lhs, rhs) => reduce(addition(lhs, rhs))),
    ),
  )
}
