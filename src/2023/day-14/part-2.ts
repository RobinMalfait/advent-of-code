import { rotateGrid } from 'aoc-utils'

enum Type {
  Empty = '.',
  SquareRock = '#',
  RoundRock = 'O',
}

export default function (blob: string, cycles = 1_000_000_000) {
  let grid = parse(blob.trim())
  let key = <T>(grid: T[][]) => grid.map((row) => row.join('')).join('\n')

  let seen = new Map<string, number>([])

  // Perform routine until we detect a cycle (repeated state)
  let completed = 0
  do {
    seen.set(key(grid), completed++)
    grid = cycle(grid)
  } while (!seen.has(key(grid)))

  let remaining = cycles - completed
  let firstOccurence = seen.get(key(grid))
  let cycleLength = completed - firstOccurence
  let todo = remaining % cycleLength

  // Perform the remaining cycles
  for (let _ of Array(todo)) {
    grid = cycle(grid)
  }

  let total = 0
  for (let [y, row] of grid.entries()) {
    for (let type of row) {
      if (type === Type.RoundRock) {
        total += grid.length - y
      }
    }
  }
  return total
}

function cycle(grid: Type[][]) {
  grid = tilt(grid)
  grid = rotateGrid(grid, -90)
  grid = tilt(grid)
  grid = rotateGrid(grid, -90)
  grid = tilt(grid)
  grid = rotateGrid(grid, -90)
  grid = tilt(grid)
  grid = rotateGrid(grid, -90)

  return grid
}

function tilt(grid: Type[][]) {
  for (let y = 0; y < grid.length; y++) {
    let row = grid[y]
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== Type.RoundRock) continue

      let newY = y
      while (newY - 1 >= 0 && grid[newY - 1][x] === Type.Empty) {
        newY--
      }
      if (newY !== y) {
        grid[newY][x] = grid[y][x]
        grid[y][x] = Type.Empty
      }
    }
  }
  return grid
}

function parse(input: string): Type[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => line.trim().split('') as Type[])
}
