import { Point, pointsToSize } from 'aoc-utils'

enum Type {
  Empty = '.',
  SquareRock = '#',
  RoundRock = 'O',
}

export default function (blob: string) {
  let field = parse(blob.trim())
  let { height } = pointsToSize(field)

  // Tilt
  for (let [point, type] of field) {
    if (type === Type.RoundRock) {
      let next = point
      while (next.up().y >= 0 && !field.has(next.up())) {
        next = next.up()
      }
      if (next !== point) {
        field.delete(point)
        field.set(next, type)
      }
    }
  }

  // Count
  let total = 0
  for (let [point, type] of field) {
    if (type === Type.RoundRock) {
      total += height - point.y
    }
  }
  return total
}

function parse(input: string) {
  return new Map(
    input
      .trim()
      .split('\n')
      .flatMap((line, y) =>
        line
          .trim()
          .split('')
          .flatMap((char, x) => {
            if (char === '.') return []
            return [[Point.new(x, y), char]]
          }),
      ),
  )
}
