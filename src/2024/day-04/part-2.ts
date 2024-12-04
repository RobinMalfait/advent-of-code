import { parseIntoGrid } from 'aoc-utils'

export default function (blob: string) {
  let grid = parseIntoGrid(blob)

  let instances = 0
  for (let [point, letter] of grid) {
    if (letter !== 'A') continue

    let nw = grid.get(point.nw())
    let se = grid.get(point.se())
    let ne = grid.get(point.ne())
    let sw = grid.get(point.sw())

    if ((nw !== 'M' && nw !== 'S') || nw === se) continue
    if ((se !== 'M' && se !== 'S') || nw === se) continue
    if ((ne !== 'M' && ne !== 'S') || ne === sw) continue
    if ((sw !== 'M' && sw !== 'S') || ne === sw) continue

    instances++
  }

  return instances
}
