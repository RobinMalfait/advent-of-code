import { DefaultMap, parseIntoGrid, queue, type Point } from 'aoc-utils'

enum Kind {
  Track = '.',
  Wall = '#',
}

export default function (blob: string, timeToCheat = 2) {
  let start: Point | null = null
  let end: Point | null = null
  let grid = parseIntoGrid(blob, (v, position) => {
    if (v === 'S') {
      start = position
      return Kind.Track
    }

    if (v === 'E') {
      end = position
      return Kind.Track
    }

    return v as Kind
  })

  let q = queue([start])
  let seen = new Set<Point>([])
  for (let position of q) {
    seen.add(position)
    if (position === end) break
    for (let n of position.neighbours()) {
      if (grid.get(n) === Kind.Track && !seen.has(n)) {
        q.push(n)
      }
    }
  }

  let total = 0
  let path = Array.from(seen)

  for (let aIdx = 0; aIdx < path.length - 1; aIdx++) {
    for (let bIdx = aIdx + 1; bIdx < path.length; bIdx++) {
      let stepsBetween = path[aIdx].manhattanDistanceTo(path[bIdx])
      if (stepsBetween > timeToCheat) continue

      let currentStepsBetween = bIdx - aIdx
      if (currentStepsBetween - stepsBetween >= 100) total++
    }
  }

  return total
}
