import { parseIntoGrid, SKIP } from 'aoc-utils'

export default function (blob: string) {
  let grid = parseIntoGrid(blob, (x) => (x === '@' ? '@' : SKIP))

  let total = 0
  let repeat = true
  while (repeat) {
    repeat = false

    next: for (let location of grid.keys()) {
      let paper = 0
      for (let n of location.neighbours8()) {
        if (grid.has(n)) paper++ // Adjacent paper found
        if (paper >= 4) continue next // Too much paper
      }
      repeat = true
      grid.delete(location)
      total += 1
    }
  }

  return total
}
