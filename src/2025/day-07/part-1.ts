import { parseIntoGrid, uniqueQueue, type Point } from 'aoc-utils'

export default function (blob: string) {
  let start: Point
  let grid = parseIntoGrid(blob, (x, point) => {
    if (x === 'S') start = point
    return x
  })

  let split = 0

  let q = uniqueQueue<Point>([start])
  for (let current of q) {
    switch (grid.get(current.down())) {
      case '.': {
        q.push(current.down())
        break
      }

      case '^': {
        split++
        q.push(current.down().left())
        q.push(current.down().right())
        break
      }
    }
  }

  return split
}
