import {
  DefaultMap,
  Direction,
  type Point,
  parseIntoGrid,
  priorityQueue,
  rotateDirection,
} from 'aoc-utils'

enum Kind {
  Wall = '#',
  Empty = '.',
}

export default function (blob: string) {
  let start: Point | null = null
  let end: Point | null = null

  let grid = parseIntoGrid(blob, (value, position) => {
    if (value === 'S') {
      start = position
      return Kind.Empty
    }

    if (value === 'E') {
      end = position
      return Kind.Empty
    }

    return value as Kind
  })

  let seen = new Set<State>()
  let q = priorityQueue<[score: number, state: State, path: Point[]]>(
    ([score]) => score,
    [[0, State.new(start, Direction.East), [start]]]
  )

  let best = Number.POSITIVE_INFINITY
  let points = new Set<Point>()
  for (let [score, state, path] of q) {
    seen.add(State.new(state.position, state.direction))

    if (state.position === end) {
      if (score > best) break

      best = score
      for (let point of path) {
        points.add(point)
      }
    }

    {
      let next = state.position.navigate(state.direction)
      let nextState = State.new(next, state.direction)
      if (!seen.has(nextState) && grid.get(nextState.position) === Kind.Empty) {
        q.push([score + 1, nextState, path.concat(next)])
      }
    }

    {
      let next = State.new(state.position, rotateDirection(state.direction, 90))
      if (!seen.has(next) && grid.get(next.position) === Kind.Empty) {
        q.push([score + 1000, next, path])
      }
    }

    {
      let next = State.new(state.position, rotateDirection(state.direction, -90))
      if (!seen.has(next) && grid.get(next.position) === Kind.Empty) {
        q.push([score + 1000, next, path])
      }
    }
  }

  return points.size
}

class State {
  private static states = new DefaultMap((position: Point) => {
    return new DefaultMap((direction: Direction) => {
      return new State(position, direction)
    })
  })

  private constructor(
    public position: Point,
    public direction: Direction
  ) {}

  static new(position: Point, direction: Direction) {
    return State.states.get(position).get(direction)
  }
}
