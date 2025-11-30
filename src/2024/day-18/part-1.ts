import { Point, chunk, queue } from 'aoc-utils'

export default function (blob: string, bytes = 1024, width = 70, height = 70) {
  let grid = new Map<Point, string>(
    parse(blob)
      .slice(0, bytes)
      .map((point) => [point, '#']),
  )
  let start = Point.new(0, 0)
  let end = Point.new(width, height)

  let q = queue<[point: Point, path: Point[]]>([[start, []]])
  let seen = new Set<Point>()
  for (let [point, path] of q) {
    if (point === end) return path.length

    if (seen.has(point)) continue
    seen.add(point)

    for (let n of point.neighbours()) {
      if (grid.get(n) === '#' || seen.has(n) || n.x < 0 || n.y < 0 || n.x > width || n.y > height) {
        continue
      }

      q.push([n, [...path, n]])
    }
  }
}

function parse(input: string) {
  return chunk(input.match(/(\d+)/g).map(Number), 2).map(([x, y]) => Point.new(x, y))
}
