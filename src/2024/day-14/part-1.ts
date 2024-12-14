import { chunk, Point } from 'aoc-utils'

export default function (blob: string, wide = 101, tall = 103) {
  let robots = parse(blob)
  let bounds = { x: wide, y: tall }

  for (let _ of Array(100)) {
    for (let robot of robots) {
      robot.move(bounds)
    }
  }

  let quadrants: number[] = [0, 0, 0, 0]

  let x = (wide / 2) | 0
  let y = (tall / 2) | 0
  for (let robot of robots) {
    if (robot.position.x < x && robot.position.y < y) {
      quadrants[0]++
    } else if (robot.position.x > x && robot.position.y < y) {
      quadrants[1]++
    } else if (robot.position.x < x && robot.position.y > y) {
      quadrants[2]++
    } else if (robot.position.x > x && robot.position.y > y) {
      quadrants[3]++
    }
  }

  return quadrants[0] * quadrants[1] * quadrants[2] * quadrants[3]
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
