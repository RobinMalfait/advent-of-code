import { parseIntoGrid, Point, SKIP } from 'aoc-utils'

export default function (blob: string) {
  let grid = parseIntoGrid(blob, (v) => (v === '.' ? SKIP : v))

  let antinodes = new Set<Point>()
  for (let [point, v1] of grid) {
    for (let [other, v2] of grid) {
      if (point === other) continue
      if (v1 !== v2) continue

      let d = Point.new(point.x - other.x, point.y - other.y)
      let next = point.add(d)

      antinodes.add(point)
      antinodes.add(other)

      while (next.isWithinBounds(grid)) {
        antinodes.add(next)
        next = next.add(d)
      }
    }
  }

  return antinodes.size
}