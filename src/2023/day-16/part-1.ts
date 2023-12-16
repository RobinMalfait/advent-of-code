import { DefaultMap, Direction, Point, match } from 'aoc-utils'

enum Contraption {
  Empty = 1 << 0,
  MirrorUp = 1 << 1,
  MirrorDown = 1 << 2,
  SplitterVertical = 1 << 3,
  SplitterHorizontal = 1 << 4,
}

export default function (blob: string) {
  let grid = parse(blob)
  return compute(grid, Point.new(0, 0), Direction.East)
}

export function compute(grid: Map<Point, Contraption>, start: Point, dir: Direction) {
  let beams = new DefaultMap<Point, Set<Direction>>(() => new Set<Direction>())
  beams.get(start).add(dir)
  let q: [Point, Direction][] = [[start, dir]]

  while (q.length > 0) {
    let [beam, dir] = q.shift()
    let contraption = grid.get(beam)

    let directions = match(dir, {
      [Direction.North]: () => {
        return match(contraption, {
          [Contraption.Empty]: [dir],
          [Contraption.MirrorUp]: [Direction.East],
          [Contraption.MirrorDown]: [Direction.West],
          [Contraption.SplitterVertical]: [dir],
          [Contraption.SplitterHorizontal]: [Direction.West, Direction.East],
        })
      },
      [Direction.East]: () => {
        return match(contraption, {
          [Contraption.Empty]: [dir],
          [Contraption.MirrorUp]: [Direction.North],
          [Contraption.MirrorDown]: [Direction.South],
          [Contraption.SplitterVertical]: [Direction.North, Direction.South],
          [Contraption.SplitterHorizontal]: [dir],
        })
      },
      [Direction.South]: () => {
        return match(contraption, {
          [Contraption.Empty]: [dir],
          [Contraption.MirrorUp]: [Direction.West],
          [Contraption.MirrorDown]: [Direction.East],
          [Contraption.SplitterVertical]: [dir],
          [Contraption.SplitterHorizontal]: [Direction.West, Direction.East],
        })
      },
      [Direction.West]: () => {
        return match(contraption, {
          [Contraption.Empty]: [dir],
          [Contraption.MirrorUp]: [Direction.South],
          [Contraption.MirrorDown]: [Direction.North],
          [Contraption.SplitterVertical]: [Direction.North, Direction.South],
          [Contraption.SplitterHorizontal]: [dir],
        })
      },
    })

    for (let direction of directions) {
      let next = beam.navigate(direction)
      if (grid.has(next) && !beams.get(next).has(direction)) {
        q.push([next, direction])
        beams.get(next).add(direction)
      }
    }
  }

  return beams.size
}

export function parse(input: string) {
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
              '.': Contraption.Empty,
              '/': Contraption.MirrorUp,
              '\\': Contraption.MirrorDown,
              '|': Contraption.SplitterVertical,
              '-': Contraption.SplitterHorizontal,
            }),
          ])
      )
  )
}
