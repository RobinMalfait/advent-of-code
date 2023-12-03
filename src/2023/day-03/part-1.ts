export default function (blob: string) {
  let grid = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(''))

  let sum = 0
  let current = 0
  let hasAdjacentSymbol = false

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      let value = grid[y][x]

      // Not a number, not interested
      if (!/\d/.test(value)) {
        continue
      }

      // Check for adjacent symbols
      for (let dy of [-1, 0, 1]) {
        for (let dx of [-1, 0, 1]) {
          if (dy === 0 && dx === 0) continue // Skip self
          if (grid[y + dy]?.[x + dx] === undefined) continue // Out of bounds

          if (!/\d|\./.test(grid[y + dy]?.[x + dx])) {
            hasAdjacentSymbol ||= true
          }
        }
      }

      // Adjust the working number
      current *= 10
      current += Number(value)

      // Next character is not a number anymore, we can track the working number if it has an
      // adjacent symbol(s).
      if (grid[y][x + 1] === undefined || !/\d/.test(grid[y][x + 1])) {
        if (hasAdjacentSymbol) {
          sum += current
        }

        current = 0
        hasAdjacentSymbol = false
      }
    }
  }

  return sum
}
