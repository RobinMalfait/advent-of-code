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
  let [dir, amount] = input.split(' ')
  return {
    direction: match(dir, {
      U: Direction.North,
      R: Direction.East,
      D: Direction.South,
      L: Direction.West,
    }),
    amount: Number(amount),
  }
}
