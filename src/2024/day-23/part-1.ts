import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let connections = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split('-'))

  let grid = new DefaultMap(() => new Set<string>())
  for (let [a, b] of connections) {
    grid.get(a).add(b)
    grid.get(b).add(a)
  }

  let total = 0

  for (let a of grid.keys()) {
    for (let b of grid.get(a)) {
      for (let c of grid.get(b)) {
        if (!grid.get(a).has(c)) continue

        // Ensure we don't double count
        if (a < b && b < c) {
          if (a[0] === 't' || b[0] === 't' || c[0] === 't') {
            total++
          }
        }
      }
    }
  }

  return total
}
