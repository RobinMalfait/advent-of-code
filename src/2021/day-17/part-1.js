import { hits, range } from './solve.js'

export default function (blob) {
  let [, x1, x2, y1, y2] = /x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/g.exec(blob)
  let target = { x1: Number(x1), y1: Number(y1), x2: Number(x2), y2: Number(y2) }

  let maybeX = range(0, 15) // Meh
  let maybeY = range(0, 180) // Meh

  let maxY = 0

  for (let x of maybeX) {
    for (let y of maybeY) {
      let result = hits(x, y, target)
      if (result.state === 'hit') {
        maxY = Math.max(maxY, result.maxY)
      } else if (result.state === 'overshot') {
        break // No need to continue this loop
      }
    }
  }

  return maxY
}
