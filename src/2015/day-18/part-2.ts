import { parseIntoGrid, Point } from 'aoc-utils'

enum State {
  On = '#',
  Off = '.',
}

export default function (blob: string, steps = 100) {
  let grid = parseIntoGrid(blob)

  let corners = new Set([
    Point.new(0, 0),
    Point.new(0, grid.height - 1),
    Point.new(grid.width - 1, 0),
    Point.new(grid.width - 1, grid.height - 1),
  ])

  for (let corner of corners) {
    grid.set(corner, State.On)
  }

  while (steps-- > 0) {
    let next = new Map<Point, string>()

    for (let [point, state] of grid) {
      if (corners.has(point)) {
        next.set(point, State.On)
        continue
      }

      let onNeighbors = 0
      for (let n of point.neighbours8()) {
        if (grid.get(n) === State.On) {
          onNeighbors++
        }
      }

      if (state === State.On) {
        if (onNeighbors === 2 || onNeighbors === 3) {
          next.set(point, State.On)
        } else {
          next.set(point, State.Off)
        }
      } else if (state === State.Off) {
        if (onNeighbors === 3) {
          next.set(point, State.On)
        } else {
          next.set(point, State.Off)
        }
      }
    }

    // @ts-expect-error Update the grid, this is fine
    grid = next
  }

  let on = 0
  for (let state of grid.values()) {
    if (state === State.On) {
      on++
    }
  }
  return on
}
