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

  let seen = new Set()

  let basins = []
  for (let [rowIdx, row] of heights.entries()) {
    next: for (let [colIdx, col] of row.entries()) {
      for (let [dx, dy] of dirs) {
        if (heights?.[rowIdx + dy]?.[colIdx + dx] <= col) {
          continue next
        }
      }

      basins.push(walk(rowIdx, colIdx))
    }
  }

  function walk(rowIdx, colIdx) {
    if (seen.has(`${rowIdx},${colIdx}`)) return 0
    if (heights?.[rowIdx]?.[colIdx] === undefined) return 0
    if (heights?.[rowIdx]?.[colIdx] === 9) return 0

    seen.add(`${rowIdx},${colIdx}`)

    let total = 1
    for (let [dx, dy] of dirs) {
      total += walk(rowIdx + dy, colIdx + dx)
    }
    return total
  }

  return basins
    .sort((a, z) => z - a)
    .slice(0, 3)
    .reduce((total, current) => total * current, 1)
}
