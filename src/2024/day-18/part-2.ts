import { Point, chunk, queue } from 'aoc-utils'

export default function (blob: string, width = 70, height = 70) {
  let bytes = parse(blob).map((point) => [point, '#'] as const)
  let start = Point.new(0, 0)
  let end = Point.new(width, height)

  let low = 0
  let high = bytes.length
  next: while (low < high) {
    let mid = (low + high) >> 1

    let grid = new Map<Point, string>(bytes.slice(0, mid))
    let q = queue<[point: Point, path: Point[]]>([[start, []]])
    let seen = new Set<Point>()
    for (let [point, path] of q) {
      if (point === end) {
        low = mid + 1
        continue next
      }

      if (seen.has(point)) continue
      seen.add(point)

      for (let n of point.neighbours()) {
        if (
          grid.get(n) === '#' ||
          seen.has(n) ||
          n.x < 0 ||
          n.y < 0 ||
          n.x > width ||
          n.y > height
        ) {
          continue
        }

        q.push([n, [...path, n]])
      }
    }

    high = mid
  }

  return bytes[low - 1][0].tuple().join(',')
}

function parse(input: string) {
  return chunk(input.match(/(\d+)/g).map(Number), 2).map(([x, y]) => Point.new(x, y))
}
