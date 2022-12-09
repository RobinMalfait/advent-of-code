let direction_map: Record<string, [axis: number, delta: number]> = {
  U: [1, -1],
  R: [0, +1],
  D: [1, +1],
  L: [0, -1],
}

type Point = [x: number, y: number]

export default function (blob: string, tail_size = 1) {
  let seen = new Set<string>()
  let tail: Point[] = [...Array(tail_size + 1).keys()].map(() => [0, 0])

  let motions = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(' '))
    .map(([direction, amount]) => [direction_map[direction], Number(amount)] as const)

  for (let [[axis, delta], steps] of motions) {
    for (let _ of Array(steps)) {
      // Move head
      tail[0][axis] += delta

      // Adjust tail
      for (let i = 1; i < tail.length; i++) {
        if (touches(tail[i], tail[i - 1])) break

        tail[i][0] += Math.sign(tail[i - 1][0] - tail[i][0])
        tail[i][1] += Math.sign(tail[i - 1][1] - tail[i][1])
      }

      // Store tail history
      seen.add(tail.at(-1).join(','))
    }
  }

  return seen.size
}

function touches(a: Point, z: Point) {
  return Math.abs(a[0] - z[0]) <= 1 && Math.abs(a[1] - z[1]) <= 1
}
