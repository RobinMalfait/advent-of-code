import { Point, pairs, transpose } from 'aoc-utils'

export default function (blob: string, expansion = 2) {
  let [oldLocations, { rows, cols }] = parse(blob.trim())

  let locations = oldLocations.map((location) => {
    let rowFactor = rows.filter((row) => row < location.y).length
    let colFactor = cols.filter((col) => col < location.x).length

    return Point.new(
      location.x + colFactor * (expansion - 1),
      location.y + rowFactor * (expansion - 1)
    )
  })

  let total = 0
  for (let [a, b] of pairs(locations)) {
    total += a.manhattanDistanceTo(b)
  }
  return total
}

function parse(input: string) {
  let grid = input.split('\n').map((line) => line.trim().split(''))

  let rows = grid.flatMap((row, index) => (row.every((char) => char === Type.Empty) ? [index] : []))
  let cols = transpose(grid).flatMap((row, index) =>
    row.every((char) => char === Type.Empty) ? [index] : []
  )

  return [
    grid.flatMap((cols, row) =>
      cols.flatMap((char, col) => (char === Type.Galaxy ? [Point.new(col, row)] : []))
    ),
    { rows, cols },
  ] as const
}

enum Type {
  Empty = '.',
  Galaxy = '#',
}
