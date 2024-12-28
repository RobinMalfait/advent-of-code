import { Point, queue } from 'aoc-utils'

export default function (blob: string) {
  let favoriteNumber = Number(blob.trim())

  let q = queue<[Point, steps: number]>([[Point.new(1, 1), 0]])
  let seen = new Set<Point>()

  for (let [point, steps] of q) {
    if (steps > 50) continue
    seen.add(point)

    for (let n of point.neighbours()) {
      if (n.x < 0 || n.y < 0) {
        continue
      }

      if (seen.has(n) || isWall(n.x, n.y, favoriteNumber)) {
        continue
      }

      q.push([n, steps + 1])
    }
  }

  return seen.size
}

function isWall(x: number, y: number, favoriteNumber: number) {
  let n = x * x + 3 * x + 2 * x * y + y + y * y + favoriteNumber
  let ones = n.toString(2).split('1').length - 1
  return Boolean(ones & 1)
}
