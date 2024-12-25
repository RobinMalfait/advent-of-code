import { parseIntoPoints } from 'aoc-utils'

export default function (blob: string) {
  let patterns = parse(blob)
  let total = 0

  for (let pattern of patterns) {
    for (let other of patterns) {
      if (pattern === other) continue

      if (pattern.isDisjointFrom(other)) {
        total++
      }
    }
  }

  return total / 2
}

function parse(input: string) {
  return input
    .trim()
    .split('\n\n')
    .map((x) => parseIntoPoints(x, (v) => v === '#'))
}
