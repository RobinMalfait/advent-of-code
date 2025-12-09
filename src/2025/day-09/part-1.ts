import { max, pairs, Point } from 'aoc-utils'

export default function (blob: string) {
  let points = blob.trim().split('\n').map(Point.fromString)

  return max(pairs(points).map(([a, b]) => area(a, b)))
}

function area(a: Point, b: Point) {
  return (Math.abs(a.x - b.x) + 1) * (Math.abs(a.y - b.y) + 1)
}
