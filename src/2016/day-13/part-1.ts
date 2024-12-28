import { Point, queue } from 'aoc-utils'

export default function (blob: string, targetX = 31, targetY = 39) {
  let favoriteNumber = Number(blob.trim())
  let grid = new Set()
  let target = Point.new(targetX, targetY)

  for (let x = 0; x <= targetX; x++) {
    for (let y = 0; y <= targetY; y++) {
      if (isWall(x, y, favoriteNumber)) {
        grid.add(Point.new(x, y))
      }
    }
  }

  let q = queue<[Point, Point[]]>([[Point.new(1, 1), []]])
  let seen = new Set<Point>()

  for (let [point, path] of q) {
    seen.add(point)

    if (point === target) {
      return path.length
    }

    for (let n of point.neighbours()) {
      if (n.x < 0 || n.y < 0 || n.x > targetX || n.y > targetY) {
        continue
      }

      if (grid.has(n) || seen.has(n)) {
        continue
      }

      q.push([n, [...path, point]])
    }
  }
}

function isWall(x: number, y: number, favoriteNumber: number) {
  let n = x * x + 3 * x + 2 * x * y + y + y * y + favoriteNumber
  let ones = n.toString(2).split('1').length - 1
  return Boolean(ones & 1)
}
