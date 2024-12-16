import { type Point, parseIntoGrid, queue } from 'aoc-utils'

export default function (blob: string) {
  let grid = parseIntoGrid(blob)
  let seen = new Set<Point>()
  let total = 0

  for (let [position, value] of grid) {
    if (seen.has(position)) continue

    let plot = new Set<Point>()
    let q = queue([position])

    for (let point of q) {
      if (plot.has(point)) continue
      if (seen.has(point)) continue
      plot.add(point)
      seen.add(point)

      for (let n of point.neighbours()) {
        if (grid.get(n) === value && !plot.has(n)) {
          q.push(n)
        }
      }
    }

    let perimeter = 0
    for (let point of plot) {
      for (let n of point.neighbours()) {
        if (!plot.has(n)) {
          perimeter++
        }
      }
    }

    let area = plot.size
    total += area * perimeter
  }

  return total
}
