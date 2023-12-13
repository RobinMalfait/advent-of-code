export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split('').map(Number))
    .flatMap((row, rowIdx, grid) => row.filter((_, colIdx) => isVisibleTree(grid, rowIdx, colIdx)))
    .length
}

function isVisibleTree(grid: number[][], rowIdx: number, colIdx: number) {
  let value = grid[rowIdx][colIdx]

  return (
    grid[rowIdx].slice(0, colIdx).every((x) => x < value) ||
    grid[rowIdx].slice(colIdx + 1).every((x) => x < value) ||
    grid
      .map((row) => row[colIdx])
      .slice(0, rowIdx)
      .every((x) => x < value) ||
    grid
      .map((row) => row[colIdx])
      .slice(rowIdx + 1)
      .every((x) => x < value)
  )
}
