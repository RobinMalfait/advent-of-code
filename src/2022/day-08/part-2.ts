export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split('').map(Number))
    .flatMap((row, rowIdx, grid) =>
      row.map((_, colIdx) => calculateScenicScore(grid, rowIdx, colIdx)),
    )
    .reduce((a, z) => Math.max(a, z))
}

function calculateScenicScore(grid: number[][], rowIdx: number, colIdx: number) {
  let value = grid[rowIdx][colIdx]

  return (
    countVisibleTrees(value, grid[rowIdx].slice(0, colIdx).reverse()) *
    countVisibleTrees(value, grid[rowIdx].slice(colIdx + 1)) *
    countVisibleTrees(
      value,
      grid
        .map((row) => row[colIdx])
        .slice(0, rowIdx)
        .reverse(),
    ) *
    countVisibleTrees(value, grid.map((row) => row[colIdx]).slice(rowIdx + 1))
  )
}

function countVisibleTrees(value: number, input: number[]) {
  return input.findIndex((x) => x >= value) + 1 || input.length
}
