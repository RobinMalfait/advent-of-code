import { DefaultMap, parseIntoGrid, uniqueQueue, type Point } from 'aoc-utils'

export default function (blob: string) {
  let start: Point
  let grid = parseIntoGrid(blob, (x, point) => {
    if (x === 'S') start = point
    return x
  })

  let counter = new DefaultMap((_point: Point) => ({ count: 0 }))
  counter.get(start).count = 1

  let total = 0
  let q = uniqueQueue<Point>([start])
  for (let current of q) {
    let steps = counter.get(current).count

    if (current.y === grid.height - 1) {
      total += steps
      continue
    }

    let next = current.down()
    switch (grid.get(next)) {
      case '.': {
        counter.get(next).count += steps
        q.push(next)
        break
      }

      case '^': {
        let left = next.left()
        if (grid.get(left) === '.') {
          counter.get(left).count += steps
          q.push(left)
        }

        let right = next.right()
        if (grid.get(right) === '.') {
          counter.get(right).count += steps
          q.push(right)
        }
        break
      }
    }
  }

  return total
}
