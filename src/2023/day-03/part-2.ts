export default function (blob: string) {
  let grid = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(''))

  let gears = new DefaultMap<Point, number[]>(() => [])
  let current = 0
  let adjacentGearPositions = new Set<Point>()

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let value = grid[y][x]

      // Not a number, not interested
      if (!/\d/.test(value)) {
        continue
      }

      // Check for adjacent gear symbols
      for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
          if (dy === 0 && dx === 0) continue // Skip self
          if (grid[y + dy]?.[x + dx] === undefined) continue // Out of bounds

          if (grid[y + dy]?.[x + dx] === '*') {
            adjacentGearPositions.add(Point.new(y + dy, x + dx))
          }
        }
      }

      // Adjust the working number
      current *= 10
      current += Number(value)

      // Next character is not a number anymore, we can track the working number if it has an
      // adjacent gear symbol(s).
      if (grid[y][x + 1] === undefined || !/\d/.test(grid[y][x + 1])) {
        if (adjacentGearPositions.size > 0) {
          for (let point of adjacentGearPositions) {
            gears.get(point).push(current)
          }
        }

        current = 0
        adjacentGearPositions.clear()
      }
    }
  }

  let result = 0
  for (let numbers of gears.values()) {
    if (numbers.length === 2) {
      result += numbers.reduce((a, b) => a * b, 1)
    }
  }

  return result
}

class DefaultMap<TKey = string, TValue = any> extends Map<TKey, TValue> {
  constructor(private factory: (key: TKey) => TValue) {
    super()
  }

  get(key: TKey) {
    if (!this.has(key)) {
      this.set(key, this.factory(key))
    }

    return super.get(key)
  }
}

class Point {
  private static points = new DefaultMap<number, DefaultMap<number, Point>>((x) => new DefaultMap((y) => new Point(x, y)))
  private constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  static new(x: number, y: number) {
    return Point.points.get(x).get(y)
  }
}
