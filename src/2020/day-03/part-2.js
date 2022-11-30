import part1 from './part-1.js'

let DEFAULT_SLOPES = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
]

export default function (map, slopes = DEFAULT_SLOPES) {
  let grid = map.split('\n').map((line) => line.split(''))
  return slopes.reduce((total, slope) => total * part1(grid, slope), 1)
}
