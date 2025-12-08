import { pairs } from 'aoc-utils'

export default function (blob: string) {
  let junction_boxes = blob
    .trim()
    .split('\n')
    .map((line) => Point3D.fromString(line.trim()))

  let circuits = new Set(junction_boxes.map((box) => new Set([box])))

  let paired_boxes = Array.from(pairs(junction_boxes))
    .map(([boxA, boxB]) => [boxA.distance(boxB), boxA, boxB] as const)
    .sort((a, z) => a[0] - z[0])

  for (let [_distance, boxA, boxB] of paired_boxes) {
    let circuitForA = circuits.values().find((circuit) => circuit.has(boxA))
    let circuitForB = circuits.values().find((circuit) => circuit.has(boxB))

    if (circuitForA !== circuitForB) {
      circuits.delete(circuitForA)
      circuits.delete(circuitForB)
      circuits.add(circuitForA.union(circuitForB))
    }

    if (circuits.size === 1) {
      return boxA.x * boxB.x
    }
  }
}

class Point3D {
  private constructor(
    public x: number,
    public y: number,
    public z: number,
  ) {}

  static fromString(input: string) {
    let [x, y, z] = input.split(',').map(Number)
    return new Point3D(x, y, z)
  }

  distance(other: Point3D) {
    let dx = this.x - other.x
    let dy = this.y - other.y
    let dz = this.z - other.z

    // Technically the wrong distance, need to take the square root, but we only
    // care about relative distances so this is fine.
    return dx * dx + dy * dy + dz * dz
  }
}
