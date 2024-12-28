import { parseIntoGrid, type Point } from 'aoc-utils'

enum State {
  On = '#',
  Off = '.',
}

export default function (blob: string, steps = 100) {
  let grid = parseIntoGrid(blob)

  while (steps-- > 0) {
    let next = new Map<Point, string>()

    for (let [point, state] of grid) {
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
