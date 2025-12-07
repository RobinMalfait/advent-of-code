import { DefaultMap, parseIntoGrid, type Point } from 'aoc-utils'

export default function (blob: string) {
  let start: Point
  let grid = parseIntoGrid(blob, (x, point) => {
    if (x === 'S') start = point
    return x
  })

  let steps = new DefaultMap((point: Point) => {
    let next = point.down()

    if (next.y === grid.height - 1) {
      return 1
    }

    if (grid.get(next) === '^') {
      return steps.get(next.left()) + steps.get(next.right())
    }

    return steps.get(next)
  })

  return steps.get(start)
}
