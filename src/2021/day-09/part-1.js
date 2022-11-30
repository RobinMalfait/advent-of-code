export default function (blob) {
  let heights = blob
    .trim()
    .split('\n')
    .map((line) => line.split('').map(Number))

  let dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ]

  let total = 0
  for (let [rowIdx, row] of heights.entries()) {
    next: for (let [colIdx, col] of row.entries()) {
      for (let [dx, dy] of dirs) {
        if (heights?.[rowIdx + dy]?.[colIdx + dx] <= col) {
          continue next
        }
      }

      total += col + 1
    }
  }

  return total
}
