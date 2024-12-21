import { DefaultMap, Direction, Point, queue, windows } from 'aoc-utils'

let NUMERIC_KEYPAD = keypad([
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  [null, '0', 'A'],
])

let DIRECTIONAL_KEYPAD = keypad([
  [null, '^', 'A'],
  ['<', 'v', '>'],
])

export default function (blob: string, TOTAL_ROBOTS = 2) {
  let codes = blob
    .trim()
    .split('\n')
    .map((line) => line.trim())

  let pathsBetweenKeys = new DefaultMap((keypad: DefaultMap<string, Map<string, string>>) => {
    return new DefaultMap((fromKey: string) => {
      return new DefaultMap((toKey: string) => {
        let q = queue<[key: string, path: string]>([[fromKey, '']])
        let paths: string[] = []

        for (let [fromKey, path] of q) {
          if (fromKey === toKey) {
            if (paths.length !== 0 && path.length > paths[0].length) break // Stop when we find a longer path

            paths.push(`${path}A`) // Need to press `A` to activate
            continue
          }

          for (let [nextKey, direction] of keypad.get(fromKey)) {
            q.push([nextKey, `${path}${direction}`])
          }
        }

        return paths
      })
    })
  })

  let solve = new DefaultMap((code: string) => {
    return new DefaultMap((robots: number) => {
      let keypad = robots === TOTAL_ROBOTS ? NUMERIC_KEYPAD : DIRECTIONAL_KEYPAD
      let total = 0

      // Prepend `A` to start because:
      // > When the robot arrives at the numeric keypad, its robotic arm is
      // > pointed at the A button in the bottom right corner.
      for (let [fromKey, toKey] of windows(`A${code}`, 2)) {
        let paths = pathsBetweenKeys.get(keypad).get(fromKey).get(toKey)

        // Final robot
        if (robots === 0) {
          let shortest = Number.POSITIVE_INFINITY
          for (let path of paths) {
            if (path.length < shortest) shortest = path.length
          }
          total += shortest
        }

        // Next robot
        else {
          let shortest = Number.POSITIVE_INFINITY
          for (let path of paths) {
            let total = solve.get(path).get(robots - 1)
            if (total < shortest) shortest = total
          }
          total += shortest
        }
      }

      return total
    })
  })

  let total = 0
  for (let code of codes) {
    let presses = solve.get(code).get(TOTAL_ROBOTS)
    let value = Number(code.slice(0, -1))
    total += presses * value
  }
  return total
}

function keypad(input: (string | null)[][]) {
  // 1. Compute grid of keypad locations
  let grid = new Map<Point, string>()
  for (let [r, row] of input.entries()) {
    for (let [c, col] of row.entries()) {
      if (col === null) continue
      grid.set(Point.new(c, r), col)
    }
  }

  // 2. Pre-compute neighbours and the direction to reach them
  let neighbours = new DefaultMap(() => new Map<string, string>())

  for (let [fromPosition, fromKey] of grid) {
    for (let otherPosition of fromPosition.neighbours()) {
      let toKey = grid.get(otherPosition)
      if (!toKey) continue

      let direction = fromPosition.direction(otherPosition)
      if (direction === Direction.East) {
        neighbours.get(fromKey).set(toKey, '>')
      } else if (direction === Direction.West) {
        neighbours.get(fromKey).set(toKey, '<')
      } else if (direction === Direction.North) {
        neighbours.get(fromKey).set(toKey, '^')
      } else if (direction === Direction.South) {
        neighbours.get(fromKey).set(toKey, 'v')
      }
    }
  }

  return neighbours
}
