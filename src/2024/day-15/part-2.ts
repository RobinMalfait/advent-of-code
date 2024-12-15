import { Direction, parseDirection, parseIntoGrid, type Point } from 'aoc-utils'

enum Kind {
  Robot = '@',
  Wall = '#',
  Empty = '.',
  LBox = '[',
  RBox = ']',
}

export default function (blob: string) {
  let [map, patterns] = blob.split('\n\n')
  let robot: Point | null = null
  let grid = parseIntoGrid(expand(map), (value, point) => {
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

    if (value === Kind.LBox || value === Kind.RBox) {
      if (canMoveBox(next, move)) {
        moveBox(next, move)
        robot = next
      }
    }
  }

  let total = 0
  for (let [point, value] of grid) {
    if (value === Kind.LBox) {
      total += 100 * point.y + point.x
    }
  }

  return total

  function canMoveBox(pos: Point, direction: Direction): boolean {
    // Horizontal:
    //
    // []→[] | []←[]
    if (direction === Direction.East || direction === Direction.West) {
      let next = pos.navigate(direction)
      while (true) {
        let nextValue = grid.get(next)
        if (nextValue === Kind.Wall) return false
        if (nextValue === Kind.Empty) return true
        next = next.navigate(direction)
      }
    }

    // Vertical:
    //
    // []  | [][] | [] |  [] | []  | [][] | [] |  []
    //  ↑  |  ↑↑  | ↑↑ |  ↑  |  ↓  |  ↓↓  | ↓↓ |  ↓
    //  [] |  []  | [] | []  |  [] |  []  | [] | []
    if (direction === Direction.North || direction === Direction.South) {
      let value = grid.get(pos)
      let [lhs, rhs] = value === Kind.LBox ? [pos, pos.right()] : [pos.left(), pos]

      let nextLhs = lhs.navigate(direction)
      let nextLhsValue = grid.get(nextLhs)
      if (nextLhsValue === Kind.Wall) return false

      let nextRhs = rhs.navigate(direction)
      let nextRhsValue = grid.get(nextRhs)
      if (nextRhsValue === Kind.Wall) return false

      if (nextLhsValue === Kind.Empty && nextRhsValue === Kind.Empty) return true
      if (nextLhsValue === Kind.Empty) return canMoveBox(nextRhs, direction)
      if (nextRhsValue === Kind.Empty) return canMoveBox(nextLhs, direction)
      return canMoveBox(nextLhs, direction) && canMoveBox(nextRhs, direction)
    }

    return false
  }

  function moveBox(pos: Point, direction: Direction) {
    // Horizontal:
    //
    // []→[] | []←[]
    if (direction === Direction.East || direction === Direction.West) {
      let nextPosition = pos.navigate(direction, 2)
      let nextValue = grid.get(nextPosition)
      if (nextValue === Kind.Empty) {
        grid.set(pos, Kind.Empty)
        grid.set(pos.navigate(direction, 2), direction === Direction.East ? Kind.RBox : Kind.LBox)
        grid.set(pos.navigate(direction, 1), direction === Direction.East ? Kind.LBox : Kind.RBox)
      } else {
        moveBox(nextPosition, direction) // Move others
        moveBox(pos, direction) // Move self
      }
    }

    // Vertical:
    //
    // []  | [][] | [] |  [] | []  | [][] | [] |  []
    //  ↑  |  ↑↑  | ↑↑ |  ↑  |  ↓  |  ↓↓  | ↓↓ |  ↓
    //  [] |  []  | [] | []  |  [] |  []  | [] | []
    else if (direction === Direction.North || direction === Direction.South) {
      let value = grid.get(pos)

      let [lhs, rhs] = value === Kind.LBox ? [pos, pos.right()] : [pos.left(), pos]
      if (!lhs || !rhs) return

      let nextLhs = lhs.navigate(direction)
      let nextLhsValue = grid.get(nextLhs)

      let nextRhs = rhs.navigate(direction)
      let nextRhsValue = grid.get(nextRhs)

      if (nextLhsValue === Kind.Empty && nextRhsValue === Kind.Empty) {
        grid.set(lhs, Kind.Empty)
        grid.set(rhs, Kind.Empty)
        grid.set(nextLhs, Kind.LBox)
        grid.set(nextRhs, Kind.RBox)
      } else if (nextLhsValue === Kind.Empty) {
        moveBox(nextRhs, direction)
        moveBox(pos, direction)
      } else {
        // []       []       [][]
        // []  or  [][]  or   []
        moveBox(nextLhs, direction)
        moveBox(pos, direction)
      }
    }
  }
}

function expand(input: string) {
  return input.replace(/[#.@O]/g, (char) => {
    if (char === '#') return '##'
    if (char === '.') return '..'
    if (char === '@') return '@.'
    if (char === 'O') return '[]'
    return char
  })
}
