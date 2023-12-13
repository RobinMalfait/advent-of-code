import { Point, bail, match, range, sum, transposePointMap } from 'aoc-utils'

export default function (blob: string) {
  return sum(
    parse(blob.trim())
      .map(split)
      .map(([orientation, x]) => {
        return match(orientation, {
          [Split.Vertical]: x,
          [Split.Horizontal]: x * 100,
        })
      })
  )
}

enum Split {
  Horizontal,
  Vertical,
}

function split([grid, { width, height }]: [Map<Point, string>, { width: number; height: number }]) {
  return (
    // Horizontal
    findSplitPoint(grid, width, height, Split.Horizontal) ||
    // Vertical
    findSplitPoint(transposePointMap(grid), height, width, Split.Vertical) ||
    // Sad
    bail('Could not find a split point. Big sad.')
  )
}

function findSplitPoint(
  pattern: Map<Point, string>,
  width: number,
  height: number,
  orientation: Split
) {
  next: for (let y = 1; y < height; y++) {
    let r = Math.min(y, height - y)
    let ys = Array.from(range(0, r)).map((i) => [y - i - 1, y + i])

    for (let x = 0; x < width; x++) {
      for (let [y1, y2] of ys) {
        if (pattern.get(Point.new(x, y1)) !== pattern.get(Point.new(x, y2))) {
          continue next
        }
      }
    }

    return [orientation, y] as const
  }
}

function parse(input: string) {
  return input.split('\n\n').map(parsePatterns)
}

function parsePatterns(input: string) {
  let width = 0
  let height = 0

  let points = new Map(
    input
      .trim()
      .split('\n')
      .flatMap((line, y) =>
        line
          .trim()
          .split('')
          .flatMap((char, x) => {
            width = Math.max(width, x + 1)
            height = Math.max(height, y + 1)

            return [[Point.new(x, y), char]]
          })
      )
  )

  return [points, { width, height }] as const
}
