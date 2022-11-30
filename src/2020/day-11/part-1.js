let EMPTY = 'L'
let OCCUPIED = '#'

export default function (blob) {
  let grid = blob
    .trim()
    .split('\n')
    .map((line) => line.split(''))

  let rows = grid.length
  let cols = grid[0].length

  let line = grid.flat()

  let dirs = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ]

  function canSeeSeat(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols) return false
    return line[row * cols + col] === OCCUPIED
  }

  let next = line
  let change = false
  do {
    change = false
    line = next
    next = line.slice()

    for (let i = 0; i < line.length; i++) {
      let row = (i / cols) | 0
      let col = i % cols

      switch (line[i]) {
        case EMPTY:
          if (!dirs.some(([dr, dc]) => canSeeSeat(row + dr, col + dc))) {
            next[i] = OCCUPIED
            change = true
          }
          break
        case OCCUPIED:
          {
            let occupiedNeighbours = 0
            for (let [dc, dr] of dirs) {
              if (canSeeSeat(row + dr, col + dc) && ++occupiedNeighbours >= 4) {
                next[i] = EMPTY
                change = true
                break
              }
            }
          }
          break
      }
    }
  } while (change)

  return next.filter((seat) => seat === OCCUPIED).length
}
