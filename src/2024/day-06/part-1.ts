import { Direction, type Point, parseIntoGrid } from 'aoc-utils'

enum Kind {
  Free = '.',
  Guard = '^',
  Obstruction = '#',
}

export default function (blob: string) {
  let grid = parseIntoGrid(blob)

  let start: Point = null
  let direction = Direction.North
  for (let [position, value] of grid) {
    if (value === Kind.Guard) {
      start = position
      grid.set(position, Kind.Free)
      break
    }
  }

  let seen = new Set([start])
  let current = start

  while (true) {
    seen.add(current)

    let step = current.navigate(direction)
    let value = grid.get(step)

    // Free spot, step forward
    if (value === Kind.Free) {
      current = step
    }

    // Blocked, turn right
    else if (value === Kind.Obstruction) {
      if (direction === Direction.North) direction = Direction.East
      else if (direction === Direction.East) direction = Direction.South
      else if (direction === Direction.South) direction = Direction.West
      else if (direction === Direction.West) direction = Direction.North
    }

    // Off the grid, we're done
    else {
      return seen.size
    }
  }
}
