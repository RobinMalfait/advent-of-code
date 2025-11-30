import { DefaultMap, parseIntoGrid, queue, type Point } from 'aoc-utils'

const KEY = /[a-z]/
const DOOR = /[A-Z]/

export default function (blob: string) {
  let entrance: Point | null = null
  let collectionCount = 0
  let grid = parseIntoGrid(blob, (value, p) => {
    if (value === '@') {
      entrance = p
      return '.'
    }
    if (KEY.test(value) || DOOR.test(value)) {
      collectionCount++
    }
    return value
  })

  let q = queue<[state: State, steps: number]>([[State.new(entrance, ''), 0]])
  let seen = new Set<State>()

  for (let [state, steps] of q) {
    if (state.collected.length === collectionCount) {
      return steps
    }

    if (!grid.has(state.point)) continue
    if (seen.has(state)) continue
    seen.add(state)

    for (let n of state.point.neighbours()) {
      if (!grid.has(n)) continue // Out of bounds

      let value = grid.get(n)

      if (value === '#') continue // Wall
      if (value === '.') q.push([State.new(n, state.collected), steps + 1]) // Open space

      if (KEY.test(value)) {
        grid.set(n, '.')
        q.push([State.new(n, `${state.collected}${value}`), steps + 1])
      }

      if (DOOR.test(value) && state.collected.includes(value.toLowerCase())) {
        grid.set(n, '.')
        q.push([State.new(n, `${state.collected}${value}`), steps + 1])
      }
    }
  }

  return -1
}

class State {
  private static states = new DefaultMap((point: Point) => {
    return new DefaultMap((collected: string) => {
      return new State(point, collected)
    })
  })

  private constructor(
    public point: Point,
    public collected: string
  ) {}

  static new(point: Point, collected: string) {
    return State.states.get(point).get(collected)
  }
}
