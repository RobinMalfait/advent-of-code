import { Point, match } from 'aoc-utils'

enum Type {
  /** `.` */
  Empty = 1 << 0,

  /** `S` */
  Start = 1 << 1,

  /** Looks like: `─` */
  Horizontal = 1 << 2,

  /** `│` */
  Vertical = 1 << 3,

  /** `┌` */
  TL = 1 << 4,

  /** `┐` */
  TR = 1 << 5,

  /** `└` */
  BL = 1 << 6,

  /** `┘` */
  BR = 1 << 7,
}

// Attachments
let left = Type.Horizontal | Type.BL | Type.TL
let right = Type.Horizontal | Type.BR | Type.TR
let up = Type.Vertical | Type.TL | Type.TR
let down = Type.Vertical | Type.BL | Type.BR

export default function (blob: string) {
  let [map, start] = parse(blob.trim())
  let scouts = [start, start]
  let scoutPaths = [new Set([start]), new Set([start])]
  let scoutTypes = [infertTypeOf(map, start), infertTypeOf(map, start)]
  let steps = 0

  while (steps === 0 || scouts[0] !== scouts[1]) {
    steps++

    next: for (let [idx, scout] of scouts.entries()) {
      for (let [dx, dy] of idx === 0
        ? [
            [+0, -1], // Top
            [+1, +0], // Right
            [+0, +1], // Bottom
            [-1, +0], // Left
          ]
        : [
            [+0, +1], // Bottom
            [-1, +0], // Left
            [+0, -1], // Top
            [+1, +0], // Right
          ]) {
        let p = Point.new(scout.x + dx, scout.y + dy)

        if (scoutPaths[idx].has(p)) continue // Already seen
        if (!map.has(p)) continue // Off grid

        let n = map.get(p)

        if (
          // When going up
          (dx === 0 && dy === -1 && down & scoutTypes[idx] && up & n) ||
          // When going down
          (dx === 0 && dy === 1 && up & scoutTypes[idx] && down & n) ||
          // When going left
          (dx === -1 && dy === 0 && right & scoutTypes[idx] && left & n) ||
          // When going right
          (dx === 1 && dy === 0 && left & scoutTypes[idx] && right & n)
        ) {
          scouts[idx] = p
          scoutPaths[idx].add(p)
          scoutTypes[idx] = n
          continue next
        }
      }
    }
  }

  return steps
}

// Assumption: there are no overlapping pipes, so we can infer the type of a pipe based on its
// neighbours.
function infertTypeOf(map: Map<Point, Type>, p: Point) {
  let lookup = new Map([
    [Type.Vertical, [up, null, down, null]],
    [Type.Horizontal, [null, right, null, left]],
    [Type.TL, [null, right, down, null]],
    [Type.TR, [null, null, down, left]],
    [Type.BL, [up, right, null, null]],
    [Type.BR, [up, null, null, left]],
  ])

  for (let [type, [up, right, down, left]] of lookup) {
    if (
      (up === null || up & map.get(p.up())) &&
      (right === null || right & map.get(p.right())) &&
      (down === null || down & map.get(p.down())) &&
      (left === null || left & map.get(p.left()))
    ) {
      return type
    }
  }

  throw new Error(`Unable to infer type of ${p}`)
}

function parse(input: string) {
  let start: Point = null
  return [
    new Map(
      input.split('\n').flatMap((line, y) => {
        return line
          .trim()
          .split('')
          .map((char, x) => {
            if (char === 'S') start = Point.new(x, y)
            return [
              Point.new(x, y),
              match(char, {
                '.': Type.Empty,
                '-': Type.Horizontal,
                '|': Type.Vertical,
                F: Type.TL,
                '7': Type.TR,
                L: Type.BL,
                J: Type.BR,
                S: Type.Start,
              }),
            ] as const
          })
      }),
    ),
    start,
  ] as const
}

// let typeToString = new Map<Type, string>([
//   [Type.Empty, ' '],
//   [Type.Start, 'S'],
//
//   [Type.Horizontal, '─'],
//   [Type.Vertical, '│'],
//
//   [Type.TL, '┌'],
//   [Type.TR, '┐'],
//   [Type.BL, '└'],
//   [Type.BR, '┘'],
//   // [Type.TL, '╭'],
//   // [Type.TR, '╮'],
//   // [Type.BL, '╰'],
//   // [Type.BR, '╯'],
// ])
