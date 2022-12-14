export default function (blob: string) {
  let [grid, bottom] = parseInput(blob)

  outer: while (true) {
    let x = 500
    let y = 0

    while (true) {
      if (!grid.has(key(x, y + 1))) {
        y += 1
        if (y == bottom) break outer
      } else if (!grid.has(key(x - 1, y + 1))) {
        x -= 1
      } else if (!grid.has(key(x + 1, y + 1))) {
        x += 1
      } else {
        grid.set(key(x, y), Tile.Sand)
        break
      }
    }
  }

  return Array.from(grid.values()).filter((x) => x === Tile.Sand).length
}

function parseInput(blob: string): [Map<string, Tile>, number] {
  let grid = new Map<string, Tile>()
  let paths = blob
    .trim()
    .split('\n')
    .flatMap((line) =>
      line
        .trim()
        .split(' -> ')
        .map((raw_points) => raw_points.split(',').map(Number))
        .map((_, i, all) => all.slice(i, i + 2))
        .slice(0, -1)
    )

  let bottom = 0

  for (let [[from_x, from_y], [to_x, to_y]] of paths) {
    let min_x = Math.min(from_x, to_x)
    let min_y = Math.min(from_y, to_y)
    let max_x = Math.max(from_x, to_x)
    let max_y = Math.max(from_y, to_y)

    for (let x = min_x; x <= max_x; x++) {
      for (let y = min_y; y <= max_y; y++) {
        bottom = Math.max(bottom, y)
        grid.set(key(x, y), Tile.Rock)
      }
    }
  }

  return [grid, bottom]
}

enum Tile {
  Rock,
  Sand,
}

function key(x: number, y: number) {
  return `${x},${y}`
}
