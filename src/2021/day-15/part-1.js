import { solve } from './solve.js'

export default function (blob) {
  let grid = blob
    .trim()
    .split('\n')
    .map((line) => line.split('').map(Number))
    .map((row, y) => row.map((cost, x) => ({ cost, x, y })))

  let result = solve(grid)
  result.shift() // The starting positiong is never entered

  //
  return result.map((node) => node.cost).reduce((total, current) => total + current, 0)
}
