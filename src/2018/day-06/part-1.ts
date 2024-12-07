import { DefaultMap, Point } from 'aoc-utils'

export default function (blob: string) {
  let points = blob
    .trim()
    .split('\n')
    .map((line) => Point.fromString(line.trim()))

  let minX = points.reduce((acc, p) => Math.min(acc, p.x), Number.POSITIVE_INFINITY)
  let maxX = points.reduce((acc, p) => Math.max(acc, p.x), Number.NEGATIVE_INFINITY)
  let minY = points.reduce((acc, p) => Math.min(acc, p.y), Number.POSITIVE_INFINITY)
  let maxY = points.reduce((acc, p) => Math.max(acc, p.y), Number.NEGATIVE_INFINITY)

  let corners = points.filter((p) => p.x === minX || p.x === maxX || p.y === minY || p.y === maxY)

  let counter = new DefaultMap<Point, number>(() => 0)

  for (let x = minX; x <= maxX; ++x) {
    for (let y = minY; y <= maxY; ++y) {
      let other = Point.new(x, y)

      let [a, b] = points
        .slice()
        .sort((a, z) => a.manhattanDistanceTo(other) - z.manhattanDistanceTo(other))
      if (a.manhattanDistanceTo(other) === b.manhattanDistanceTo(other)) {
        continue // Point is close to 2 points
      }

      let winner = a
      counter.set(winner, counter.get(winner) + 1)
    }
  }

  for (let corner of corners) {
    counter.delete(corner)
  }

  let maxArea = Number.NEGATIVE_INFINITY
  for (let x of counter.values()) {
    maxArea = Math.max(maxArea, x)
  }

  return maxArea
}
