import { Point, chunk, queue } from 'aoc-utils'

export default function (blob: string, width = 70, height = 70) {
  let bytes = parse(blob).map((point) => [point, '#'] as const)
  let start = Point.new(0, 0)
  let end = Point.new(width, height)

  next: for (let idx of bytes.keys()) {
    let grid = new Map<Point, string>(bytes.slice(0, idx))
    let q = queue<[point: Point, path: Point[]]>([[start, []]])
    let seen = new Set<Point>()
    for (let [point, path] of q) {
      if (point === end) continue next

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

    return bytes[idx - 1][0].tuple().join(',')
  }
}

function parse(input: string) {
  return chunk(input.match(/(\d+)/g).map(Number), 2).map(([x, y]) => Point.new(x, y))
}
