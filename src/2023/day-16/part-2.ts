import { Direction, Point, pointsToSize } from 'aoc-utils'
import { compute, parse } from './part-1'

export default function (blob: string) {
  let grid = parse(blob)
  let max = -Infinity
  let { width, height } = pointsToSize(grid)

  // First and last row
  for (let x = 0; x < width; x++) {
    max = Math.max(max, compute(grid, Point.new(x, 0), Direction.South))
    max = Math.max(max, compute(grid, Point.new(height - x - 1, 0), Direction.North))
  }

  // First and last column
  for (let y = 0; y < height; y++) {
    max = Math.max(max, compute(grid, Point.new(0, y), Direction.East))
    max = Math.max(max, compute(grid, Point.new(width - 1, y), Direction.West))
  }

  return max
}
