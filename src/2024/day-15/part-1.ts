import { parseDirection, parseIntoGrid, type Point, type Direction } from 'aoc-utils'

enum Kind {
  Robot = '@',
  Wall = '#',
  Empty = '.',
  Box = 'O',
}

export default function (blob: string) {
  let [map, patterns] = blob.split('\n\n')
  let robot: Point | null = null
  let grid = parseIntoGrid(map, (value, point) => {
    if (value === Kind.Robot) {
      robot = point
      return Kind.Empty
    }
    return value as Kind
  })
  let movements = patterns
    .replaceAll(/[\s\n]/g, '')
    .split('')
    .map(parseDirection)

  for (let move of movements) {
    let next = robot.navigate(move)
    let value = grid.get(next)

    if (value === Kind.Wall) {
      continue
    }

    if (value === Kind.Empty) {
      robot = next
      continue
    }

    if (value === Kind.Box && moveBox(next, move)) {
      robot = next
    }
  }

  let total = 0
  for (let [point, value] of grid) {
    if (value === Kind.Box) {
      total += 100 * point.y + point.x
    }
  }

  return total

  function moveBox(pos: Point, direction: Direction) {
    let next = pos.navigate(direction)

    if (grid.get(next) === Kind.Wall) {
      return false
    }

    if (grid.get(next) === Kind.Box) {
      if (moveBox(next, direction)) {
        grid.set(pos, Kind.Empty)
        grid.set(next, Kind.Box)
        return true
      }

      return false
    }

    grid.set(pos, Kind.Empty)
    grid.set(next, Kind.Box)
    return true
  }
}
