import { Direction, Point, match, polygonArea } from 'aoc-utils'

export default function (blob: string) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
  let start = Point.new(0, 0)
  let points = [start]

  // Build map
  for (let { direction, amount } of instructions) {
    start = start.navigate(direction, amount)
    points.push(start)
  }

  return polygonArea(points)
}

function parse(input: string) {
  //       012345678
  // E.g.: (#70c710)
  //         -----    Amount in hex
  //              -   Direction
  let params = /\(#(?<amount>.{5})(?<dir>.{1})\)/.exec(input)
  return {
    direction: match(params.groups.dir, {
      3: Direction.North,
      0: Direction.East,
      1: Direction.South,
      2: Direction.West,
    }),
    amount: Number.parseInt(params.groups.amount, 16),
  }
}
