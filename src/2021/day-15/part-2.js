import { solve } from './solve.js'

export default function (blob) {
  let grid = blob
    .trim()
    .split('\n')
    .map((line) => line.split('').map(Number))

  // Expand grid
  let expand = 5
  let copy = grid.map((row) => row.slice())
  for (let i = 1; i < expand; i++) {
    for (let row of grid) {
      copy.push(row.map((x) => (x + i === 9 ? 9 : (x + i) % 9))) // Meh
    }
  }
  grid = transpose(copy)
  copy = grid.map((row) => row.slice())
  for (let i = 1; i < expand; i++) {
    for (let row of grid) {
      copy.push(row.map((x) => (x + i === 9 ? 9 : (x + i) % 9))) // Meh
    }
  }
  grid = transpose(copy)

  // Map to proper nodes
  grid = grid.map((row, y) => row.map((cost, x) => ({ cost, x, y })))

  let result = solve(grid)
  result.shift() // The starting position is never entered

  //
  return result.map((node) => node.cost).reduce((total, current) => total + current, 0)
}

function transpose(grid) {
  return grid[0].map((_, i) => grid.map((row) => row[i]))
}
