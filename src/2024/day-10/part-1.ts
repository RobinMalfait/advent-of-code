import { parseIntoGrid, queue, type Point } from 'aoc-utils'

export default function (blob: string) {
  let grid = parseIntoGrid(blob, Number)
  let starts: Point[] = []
  for (let [position, value] of grid) {
    if (value === 0) {
      starts.push(position)
    }
  }

  let total = 0
  for (let start of starts) {
    let seen = new Set()
    let q = queue([start])

    for (let next of q) {
      if (seen.has(next)) continue
      seen.add(next)

      let current = grid.get(next)
      if (current === 9) total++

      for (let n of next.neighbours()) {
        if (current + 1 === grid.get(n)) {
          q.push(n)
        }
      }
    }
  }

  return total
}
