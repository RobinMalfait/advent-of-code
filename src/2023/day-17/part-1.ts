import { DefaultMap, Direction, Point, astar, isOppositeDirection, pointsToSize } from 'aoc-utils'

class State {
  private static states = new DefaultMap<
    Point,
    DefaultMap<Direction | null, DefaultMap<number, State>>
  >(
    (position) =>
      new DefaultMap(
        (direction) =>
          new DefaultMap((directionCount) => new State(position, direction, directionCount))
      )
  )

  private constructor(
    public readonly position: Point,
    public readonly direction: Direction | null = null,
    public readonly directionCount: number = 0
  ) {}

  static new(position: Point, direction: Direction | null = null, directionCount: number = 1) {
    return State.states.get(position).get(direction).get(directionCount)
  }
}

export default function (blob: string, min = 0, max = 3) {
  let grid = parse(blob)
  let { width, height } = pointsToSize(grid)
  let start = Point.new(0, 0)
  let end = Point.new(width - 1, height - 1)

  let result = astar({
    start: State.new(start),
    *successors(state) {
      for (let n of state.position.neighbours()) {
        if (!grid.has(n)) continue // Can't go off the grid

        let direction = state.position.direction(n)

        // Can't go back the way we came
        if (isOppositeDirection(state.direction, direction)) continue

        // Try to step in the same direction for at most `max` steps
        if (state.direction === direction && state.directionCount < max) {
          yield State.new(n, direction, state.directionCount + 1)
        }

        // Step in a new direction
        else if (
          // First step, we don't have a direction yet
          state.direction === null ||
          // We do have direction, keep stepping in that direction for a minimum of `min` steps
          (state.direction !== direction && state.directionCount >= min)
        ) {
          yield State.new(n, direction)
        }
      }
    },
    success: (state) => state.position === end && state.directionCount >= min,
    value: (state) => grid.get(state.position),
  })

  // console.log(
  //   visualizePointMap(grid, (char, p) => {
  //     let state = result[0].find((s) => s.position === p)
  //     if (state && state.direction) return directionToChar(state.direction)
  //     return `${char}`
  //   })
  // )

  return result[1]
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
          .map((char, x) => [Point.new(x, y), Number(char)])
      )
  )
}
