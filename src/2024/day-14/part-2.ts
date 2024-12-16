import { Point, chunk } from 'aoc-utils'

export default async function (blob: string, wide = 101, tall = 103) {
  let robots = parse(blob)
  let bounds = { x: wide, y: tall }

  let seconds = 0
  while (++seconds) {
    for (let robot of robots) {
      robot.move(bounds)
    }

    if (detectChristmasTree(robots)) {
      // console.log(visualize(robots, bounds))
      return seconds
    }
  }
}

function parse(input: string) {
  return chunk(input.match(/(-?\d+)/g).map(Number), 4).map(([px, py, vx, vy]) => {
    return new Robot(Point.new(px, py), Point.new(vx, vy))
  })
}

class Robot {
  public constructor(
    public position: Point,
    public velocity: Point
  ) {}

  public move(bounds: { x: number; y: number }) {
    this.position = Point.new(
      (this.position.x + this.velocity.x + bounds.x) % bounds.x,
      (this.position.y + this.velocity.y + bounds.y) % bounds.y
    )
  }
}

function detectChristmasTree(robots: Robot[]) {
  let grid = new Map<Point, Robot>()
  for (let robot of robots) {
    grid.set(robot.position, robot)
  }

  // Assumption: A Christmas tree must have a base, let's say that we want at
  // least 8 robots on a horizontal line.
  let length = 8

  next: for (let robot of robots) {
    let right = Point.new(1, 0)
    let current = robot.position
    for (let _ of Array(length)) {
      let next = current.add(right)
      if (!grid.has(next)) {
        continue next
      }
      current = next
    }
    return true
  }
  return false
}

function visualize(robots: Robot[], bounds: { x: number; y: number }) {
  let grid: string[][] = []
  let positions = new Set<Point>()
  for (let robot of robots) {
    positions.add(robot.position)
  }

  for (let y = 0; y < bounds.y; y++) {
    let row = []
    for (let x = 0; x < bounds.x; x++) {
      row.push(positions.has(Point.new(x, y)) ? '#' : '.')
    }
    grid.push(row)
  }

  return `${grid.map((row) => row.join('')).join('\n')}\n`
}
