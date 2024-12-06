import { DefaultMap, Direction, Point, parseIntoGrid, pointsToSize } from 'aoc-utils'

enum Kind {
  Free = '.',
  Guard = '^',
  Obstruction = '#',
}

export default function (blob: string) {
  let grid = parseIntoGrid<Kind>(blob)

  let start: Point = null
  let direction = Direction.North
  for (let [position, value] of grid) {
    if (value === Kind.Guard) {
      start = position
      grid.set(position, Kind.Free)
      break
    }
  }

  let current = start
  let stuck = 0

  let { width, height } = pointsToSize(grid)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (start.x === x && start.y === y) continue // Start position
      let obstruction = Point.new(x, y)

      if (grid.get(obstruction) === Kind.Obstruction) continue // Existing wall

      // Setup obstruction
      grid.set(obstruction, Kind.Obstruction)

      if (isRunningInCircles(grid, current, direction)) {
        stuck++
      }

      // Remove obstruction
      grid.set(obstruction, Kind.Free)
    }
  }

  return stuck
}

function isRunningInCircles(grid: Map<Point, Kind>, current: Point, direction: Direction) {
  let walked = new DefaultMap<Direction, Set<Point>>(() => new Set<Point>())

  while (true) {
    // Have we walked this spot in this direction before?
    if (walked.get(direction).has(current)) {
      return true
    }

    walked.get(direction).add(current)

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
      return false
    }
  }
}
