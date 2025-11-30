export default function (blob: string) {
  let points = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  while (true) {
    let minY = Number.POSITIVE_INFINITY
    let maxY = Number.NEGATIVE_INFINITY

    let xCount: Record<string, number> = {}

    for (let point of points) {
      point.tick()

      xCount[point.x] ??= 0
      xCount[point.x] += 1

      minY = Math.min(minY, point.y)
      maxY = Math.max(maxY, point.y)
    }

    if (
      maxY - minY <= 10 && // All points are in the same area
      Object.values(xCount).some((v) => v >= 7) // There should be a straight line
    ) {
      return print(points)
    }
  }
}

enum Pixels {
  empty = '░',
  filled = '█',
}

function print(points: Point[]) {
  let minX = Math.min(...points.map((point) => point.x))
  let maxX = Math.max(...points.map((point) => point.x))
  let minY = Math.min(...points.map((point) => point.y))
  let maxY = Math.max(...points.map((point) => point.y))
  let grid = []
  for (let y = minY; y <= maxY; y++) {
    let row = []
    for (let x = minX; x <= maxX; x++) {
      row.push(
        points.some((point) => point.x === x && point.y === y) ? Pixels.filled : Pixels.empty,
      )
    }
    grid.push(row.join(''))
  }
  return `\n${grid.join('\n')}\n`
}

function parse(input: string) {
  let [, posX, posY, velX, velY] =
    /position=<([\s\d-]+),([\s\d-]+)> velocity=<([\s\d-]+),([\s\d-]+)>/.exec(input)
  return new Point(Number(posX), Number(posY), Number(velX), Number(velY))
}

class Point {
  constructor(
    public x: number,
    public y: number,
    private velocityX: number,
    private velocityY: number,
  ) {}
  tick() {
    this.x += this.velocityX
    this.y += this.velocityY
  }
}
