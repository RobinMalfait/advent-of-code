import { DefaultMap, Point, parseIntoGrid, queue } from 'aoc-utils'

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

    // Very small optimization
    if (plot.size === 1) {
      total += 4
      continue
    }

    // Visual of a plot
    //
    //      1
    //      ┌───────────┐
    // 12 ┌ ┌─────┬─────┐ ┐ 2
    //    │ │     │     │ │
    //    │ │  1  │  2  │ │   3
    //    │ │     │     │ ┼───┐
    //    │ ├─────┼─────┼─────┐ ┐ 4
    //    │ │     │     │     │ │
    //    │ │  3  │  4  │  5  │ │
    //    │ │     │     │     │ │
    //    └ └─────┴─────┼─────┤ │
    //      └─────────┼ │     │ │
    //      11      10│ │  6  │ │
    //          9 ┌───┼ │     │ │
    //          ┌ ┌─────┼─────┤ │
    //          │ │     │     │ │
    //          │ │  7  │  8  │ │
    //          │ │     │     │ │
    //          │ ├─────┼─────┘ ┘
    //          │ │     │ ┼───┘
    //          │ │  9  │ │   5
    //          │ │     │ │
    //        8 └ └─────┘ ┘ 6
    //            └─────┘
    //            7

    let pair: DefaultMap<Point, DefaultMap<Point, [Point, Point]>> = new DefaultMap(
      (point) => new DefaultMap((other) => [point, other])
    )

    // Track all the points on the edge of the plot. In addition to the current
    // point, also track the neighbouring point that is off the plot. This way
    // we know the side of the plot that the edge is on. (Could also just track
    // the side, but then I have to calculate the side. Meh.)
    let edges = new Set<[on: Point, off: Point]>()
    for (let point of plot) {
      for (let n of point.neighbours()) {
        if (!plot.has(n)) {
          edges.add(pair.get(point).get(n))
        }
      }
    }

    let sides = 0
    next: for (let [on, off] of edges) {
      for (let dir of [
        Point.new(1, 0), // Right
        Point.new(0, 1), // Down
      ]) {
        let nextOn = on.add(dir)
        let nextOff = off.add(dir)

        if (edges.has(pair.get(nextOn).get(nextOff))) {
          // A neighbour is also on the same edge, ignore current edge
          continue next
        }
      }

      sides++
    }

    let area = plot.size
    total += area * sides
  }

  return total
}
