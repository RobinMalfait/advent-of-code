import { Point } from 'aoc-utils'

export default function (blob: string, steps = 64) {
  let grid = parse(blob)
  let start = null
  for (let [point, char] of grid) {
    if (char === 'S') {
      start = point
      break
    }
  }

  let q = new Set([start])

  for (let _ of Array(steps)) {
    let qq = Array.from(q)
    q.clear()
    for (let location of qq) {
      for (let n of location.neighbours()) {
        if (grid.get(n) === '#') {
          continue
        }
        q.add(n)
      }
    }
  }

  return q.size
}

function parse(input: string) {
  return new Map(
    input
      .trim()
      .split('\n')
      .flatMap((line, y) =>
        line
          .trim()
          .split('')
          .map((char, x) => [Point.new(x, y), char] as const)
      )
  )
}
