export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split('').map(Number))
    .flatMap((row, rowIdx, grid) => row.map((_, colIdx) => calculateScenicScore(grid, rowIdx, colIdx)))
    .reduce((a, z) => Math.max(a, z))
}

function calculateScenicScore(grid: number[][], rowIdx: number, colIdx: number) {
  let value = grid[rowIdx][colIdx]
  let transposedGrid = transpose(grid)

  return (
    countVisibleTrees(value, grid[rowIdx].slice(0, colIdx).reverse()) *
    countVisibleTrees(value, grid[rowIdx].slice(colIdx + 1)) *
    countVisibleTrees(value, transposedGrid[colIdx].slice(0, rowIdx).reverse()) *
    countVisibleTrees(value, transposedGrid[colIdx].slice(rowIdx + 1))
  )
}

function countVisibleTrees(value: number, input: number[]) {
  return input.findIndex((x) => x >= value) + 1 || input.length
}

function transpose<T>(arr: T[][]): T[][] {
  return arr[0].map((_, idx) => arr.map((col) => col[idx]))
}
