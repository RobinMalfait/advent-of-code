export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split('').map(Number))
    .flatMap((row, rowIdx, grid) => row.filter((_, colIdx) => isVisibleTree(grid, rowIdx, colIdx))).length
}

function isVisibleTree(grid: number[][], rowIdx: number, colIdx: number) {
  let value = grid[rowIdx][colIdx]
  let transposedGrid = transpose(grid)

  return (
    grid[rowIdx].slice(0, colIdx).every((x) => x < value) ||
    grid[rowIdx].slice(colIdx + 1).every((x) => x < value) ||
    transposedGrid[colIdx].slice(0, rowIdx).every((x) => x < value) ||
    transposedGrid[colIdx].slice(rowIdx + 1).every((x) => x < value)
  )
}

function transpose<T>(arr: T[][]): T[][] {
  return arr[0].map((_, idx) => arr.map((col) => col[idx]))
}
