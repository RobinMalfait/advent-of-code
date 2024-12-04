import { Point, parseIntoGrid } from 'aoc-utils'

export default function (blob: string) {
  let grid = parseIntoGrid(blob)

  let instances = 0
  for (let [point, letter] of grid) {
    if (letter !== 'X') continue

    for (let dir of [
      Point.new(-1, +0), // North
      Point.new(-1, +1), // North-East
      Point.new(+0, +1), // East
      Point.new(+1, +1), // South-East
      Point.new(+1, +0), // South
      Point.new(+1, -1), // South-West
      Point.new(+0, -1), // West
      Point.new(-1, -1), // North-West
    ]) {
      if (grid.get(point.add(dir)) !== 'M') continue
      if (grid.get(point.add(dir).add(dir)) !== 'A') continue
      if (grid.get(point.add(dir).add(dir).add(dir)) !== 'S') continue

      instances++
    }
  }

  return instances
}
