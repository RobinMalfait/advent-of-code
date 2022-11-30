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

  function canSeeSeat(row, col, dr, dc, depth = 1) {
    let r = row + dr * depth
    let c = col + dc * depth

    if (r < 0 || r >= rows || c < 0 || c >= cols) return false

    let i = r * cols + c

    if (line[i] === OCCUPIED) return true
    if (line[i] === EMPTY) return false

    return canSeeSeat(row, col, dr, dc, depth + 1)
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
          if (!dirs.some(([dr, dc]) => canSeeSeat(row, col, dr, dc))) {
            next[i] = OCCUPIED
            change = true
          }
          break
        case OCCUPIED:
          {
            let occupiedNeighbours = 0
            for (let [dc, dr] of dirs) {
              if (canSeeSeat(row, col, dr, dc)) {
                if (++occupiedNeighbours >= 5) {
                  next[i] = EMPTY
                  change = true
                  break
                }
              }
            }
          }
          break
      }
    }
  } while (change)

  return next.filter((seat) => seat === OCCUPIED).length
}
