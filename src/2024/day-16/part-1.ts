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
  let q = priorityQueue<[score: number, state: State]>(
    ([score]) => score,
    [[0, State.new(start, Direction.East)]]
  )

  for (let [score, state] of q) {
    if (seen.has(state)) continue
    seen.add(state)

    if (grid.get(state.position) !== Kind.Empty) continue
    if (state.position === end) return score

    q.push([score + 1, State.new(state.position.navigate(state.direction), state.direction)])
    q.push([score + 1000, State.new(state.position, rotateDirection(state.direction, 90))])
    q.push([score + 1000, State.new(state.position, rotateDirection(state.direction, -90))])
  }
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
