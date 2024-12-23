import { DefaultMap, maximalCliques } from 'aoc-utils'

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

  let largest = new Set()
  for (let clique of maximalCliques(grid)) {
    if (clique.size > largest.size) {
      largest = clique
    }
  }

  return Array.from(largest).sort().join(',')
}
