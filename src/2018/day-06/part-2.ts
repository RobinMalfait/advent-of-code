import { Point } from 'aoc-utils'

export default function (blob: string, maxDistance = 10_000) {
  let points = blob
    .trim()
    .split('\n')
    .map((line) => Point.fromString(line.trim()))

  let minX = points.reduce((acc, p) => Math.min(acc, p.x), Number.POSITIVE_INFINITY)
  let maxX = points.reduce((acc, p) => Math.max(acc, p.x), Number.NEGATIVE_INFINITY)
  let minY = points.reduce((acc, p) => Math.min(acc, p.y), Number.POSITIVE_INFINITY)
  let maxY = points.reduce((acc, p) => Math.max(acc, p.y), Number.NEGATIVE_INFINITY)

  let size = 0

  for (let x = minX; x <= maxX; ++x) {
    loop: for (let y = minY; y <= maxY; ++y) {
      let other = Point.new(x, y)
      let runningDistance = 0

      for (let point of points) {
        runningDistance += point.manhattanDistanceTo(other)
        if (runningDistance >= maxDistance) continue loop
      }

      size += 1
    }
  }

  return size
}
