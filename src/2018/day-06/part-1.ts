export default function (blob: string) {
  let points = blob
    .trim()
    .split('\n')
    .map((line) => Point.fromString(line.trim()))

  let minX = points.reduce((acc, p) => Math.min(acc, p.x), Infinity)
  let maxX = points.reduce((acc, p) => Math.max(acc, p.x), -Infinity)
  let minY = points.reduce((acc, p) => Math.min(acc, p.y), Infinity)
  let maxY = points.reduce((acc, p) => Math.max(acc, p.y), -Infinity)

  let corners = points.filter((p) => p.x === minX || p.x === maxX || p.y === minY || p.y === maxY)

  let counter = new DefaultMap<Point, number>(() => 0)

  for (let x = minX; x <= maxX; ++x) {
    for (let y = minY; y <= maxY; ++y) {
      let other = Point.new(x, y)

      let [a, b] = points.slice().sort((a, z) => a.manhatten(other) - z.manhatten(other))
      if (a.manhatten(other) === b.manhatten(other)) {
        continue // Point is close to 2 points
      }

      let winner = a
      counter.set(winner, counter.get(winner) + 1)
    }
  }

  for (let corner of corners) {
    counter.delete(corner)
  }

  let maxArea = -Infinity
  for (let x of counter.values()) {
    maxArea = Math.max(maxArea, x)
  }

  return maxArea
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
  private constructor(public x: number = 0, public y: number = 0) {}

  static fromString(input: string) {
    let [x, y] = input.split(',').map(Number)
    return Point.points.get(x).get(y)
  }

  static new(x: number, y: number) {
    return Point.points.get(x).get(y)
  }

  manhatten(other: Point) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }
}
