import { DefaultMap, Direction, Point, match } from 'aoc-utils'

enum Tile {
  Path = 0,
  Forest = 1,
  Slopes = 2,
}

export default function (blob: string) {
  let grid = parse(blob)

  // Find start / end
  let start: Point = null
  let end: Point = null
  for (let [point, tile] of grid.entries()) {
    if (tile.type === Tile.Path) {
      if (start === null) start = point
      end = point
    }
  }

  // Find intersections
  let intersections = new Set<Point>([start, end])
  for (let [point, tile] of grid) {
    let ncount = 0

    if (tile.type === Tile.Path) {
      for (let n of point.neighbours()) {
        if (!grid.has(n)) continue

        let ntile = grid.get(n)

        // If the neighbour is a path, we can go there
        if (ntile.type === Tile.Path || ntile.type === Tile.Slopes) {
          ncount++
        }
      }

      // Assume you came from somewhere, then we can't go back
      ncount -= 1

      // If there are at least 2 neighbours, it's an intersection because we can choose where to go
      if (ncount >= 2) {
        intersections.add(point)
      }
    }
  }

  // Build graph
  let graph = new DefaultMap<Point, DefaultMap<Point, number>>(() => new DefaultMap(() => 0))

  for (let point of intersections) {
    let seen = new Set<Point>()
    let todo: [location: Point, distance: number][] = [[point, 0]]

    while (todo.length > 0) {
      let [location, distance] = todo.shift()

      if (distance !== 0 && intersections.has(location)) {
        graph.get(point).set(location, distance)
        continue
      }

      let tile = grid.get(location)

      if (tile.type === Tile.Path || tile.type === Tile.Slopes) {
        for (let n of location.neighbours()) {
          if (!grid.has(n)) continue // Off-grid
          if (seen.has(n)) continue // Already seen

          let ntile = grid.get(n)
          if (ntile.type === Tile.Path || ntile.type === Tile.Slopes) {
            todo.push([n, distance + 1])
            seen.add(n)
          }
        }
      }
    }
  }

  return dfs(graph, start, end)
}

function dfs(
  graph: DefaultMap<Point, DefaultMap<Point, number>>,
  start: Point,
  end: Point,
  seen = new Set<Point>()
) {
  if (start === end) {
    return 0
  }

  let max = Number.NEGATIVE_INFINITY

  seen.add(start)
  for (let [n, distance] of graph.get(start)) {
    if (seen.has(n)) continue
    max = Math.max(max, dfs(graph, n, end, seen) + distance)
  }
  seen.delete(start)

  return max
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
          .map((char, x) => [
            Point.new(x, y),
            match(char, {
              '.': { type: Tile.Path },
              '#': { type: Tile.Forest },
              '^': { type: Tile.Slopes, dir: Direction.North },
              '>': { type: Tile.Slopes, dir: Direction.East },
              v: { type: Tile.Slopes, dir: Direction.South },
              '<': { type: Tile.Slopes, dir: Direction.West },
            }),
          ])
      )
  )
}
