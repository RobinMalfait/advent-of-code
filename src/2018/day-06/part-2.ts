export default function (blob: string, maxDistance = 10_000) {
  let points = blob
    .trim()
    .split('\n')
    .map((line) => Point.fromString(line.trim()))

  let minX = points.reduce((acc, p) => Math.min(acc, p.x), Infinity)
  let maxX = points.reduce((acc, p) => Math.max(acc, p.x), -Infinity)
  let minY = points.reduce((acc, p) => Math.min(acc, p.y), Infinity)
  let maxY = points.reduce((acc, p) => Math.max(acc, p.y), -Infinity)

  let size = 0

  for (let x = minX; x <= maxX; ++x) {
    loop: for (let y = minY; y <= maxY; ++y) {
      let other = Point.new(x, y)
      let runningDistance = 0

      for (let point of points) {
        runningDistance += point.manhatten(other)
        if (runningDistance >= maxDistance) continue loop
      }

      size += 1
    }
  }

  return size
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
