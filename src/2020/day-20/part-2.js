let MONSTER = `
                  # 
#    ##    ##    ###
 #  #  #  #  #  #   
`
  .split('\n')
  .slice(1, -1)

export default function (blob) {
  let tiles = blob
    .trim()
    .split('\n\n')
    .map((tile) => tile.split('\n'))
    .map(([, ...tileData]) => new Tile(tileData.map((row) => row.split(''))))

  let edges = new Map()

  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      let tile = tiles[i]
      let other = tiles[j]
      if (tile.matches(other)) {
        if (!edges.has(tile)) edges.set(tile, new Set())
        edges.get(tile).add(other)

        if (!edges.has(other)) edges.set(other, new Set())
        edges.get(other).add(tile)
      }
    }
  }

  let backlog = new Set(tiles.slice())
  let size = Math.sqrt(tiles.length)
  let grid = Array.from(Array(size)).map(() => Array.from(Array(size)))

  for (let [tile, friends] of edges.entries()) {
    // Find the first corner
    if (friends.size !== 2) continue

    backlog.delete(tile)
    grid[0][0] = tile
    break
  }

  // Put puzzle pieces in the correct spot
  let dirs = [-1, 0] // Only have to look left and up
  while (backlog.size > 0) {
    for (let [rowIdx, row] of grid.entries()) {
      for (let [colIdx, col] of row.entries()) {
        if (col !== undefined) continue // Already filled in
        let possibilities = new Set(backlog)

        if (
          // Checking corners
          (rowIdx === 0 && colIdx === size - 1) ||
          (rowIdx === size - 1 && colIdx === size - 1) ||
          (rowIdx === size - 1 && colIdx === 0) // Bottom left corner
        ) {
          // Removing tiles that could never be corners
          for (let other of possibilities) {
            if (edges.get(other).size !== 2) possibilities.delete(other)
          }
        } else if (
          // Checking borders
          (rowIdx === 0 && colIdx >= 1 && colIdx <= size - 2) ||
          (colIdx === 0 && rowIdx >= 1 && rowIdx <= size - 2) ||
          (colIdx === size - 1 && rowIdx >= 1 && rowIdx <= size - 2) ||
          (rowIdx === size - 1 && colIdx >= 1 && colIdx <= size - 2)
        ) {
          // Removing tiles that could never be borders
          for (let other of possibilities) {
            if (edges.get(other).size !== 3) possibilities.delete(other)
          }
        } else {
          // Removing tiles that could never be middle pieces
          for (let other of possibilities) {
            if (edges.get(other).size <= 3) possibilities.delete(other)
          }
        }

        for (let dr of dirs) {
          for (let dc of dirs) {
            let nrow = rowIdx + dr
            let ncol = colIdx + dc

            if (dr === dc) continue // New tile is the same tile or diagonal which doesn't matter
            if (nrow < 0 || ncol < 0) continue // Out of bounds
            let existingNeighbour = grid[nrow][ncol]

            // Eliminate tiles from this position that don't match with its neighbour
            for (let other of possibilities) {
              if (!edges.get(other).has(existingNeighbour)) possibilities.delete(other)
            }
          }
        }

        let [next] = possibilities
        grid[rowIdx][colIdx] = next
        possibilities.delete(next)
        backlog.delete(next)
      }
    }
  }

  function* variants(tile) {
    yield tile
    for (let i = 0; i < 3; i++) yield tile.rotate()

    tile.rotate()
    yield tile.flip()

    for (let i = 0; i < 3; i++) yield tile.rotate()
  }

  function matchesTop(me, top) {
    if (!top) return true // Out of bounds, no need to verify
    return me.top() === top.bottom()
  }

  function matchesLeft(me, left) {
    if (!left) return true // Out of bounds, no need to verify
    return me.left() === left.right()
  }

  // Rotate and flip each piece, make the puzzle!
  nextCornerVariant: for (let _ of variants(grid[0][0])) {
    for (let [rowIdx, row] of grid.entries()) {
      nextPiece: for (let [colIdx, me] of row.entries()) {
        let left = grid?.[rowIdx]?.[colIdx - 1] ?? false
        let top = grid?.[rowIdx - 1]?.[colIdx] ?? false

        for (let _ of variants(me)) {
          if (matchesTop(me, top) && matchesLeft(me, left)) {
            // We found a matching piece, let's find the next one!
            continue nextPiece
          }
        }

        // We found no match for the current tile, time to rotate the corner
        // again and start over!
        continue nextCornerVariant
      }
    }

    // All tiles look good, no need to check other variants!
    break
  }

  // Drop the borders
  for (let tiles of grid) {
    for (let tile of tiles) {
      tile.grid = tile.grid.map((row) => row.slice(1, -1)) // Remove left & right
      tile.grid.splice(0, 1) // Remove top
      tile.grid.splice(tile.grid.length - 1, 1) // Remove bottom
    }
  }

  // Find the monsters
  let combinedGrid = []
  for (let [gridRowId, gridRow] of grid.entries()) {
    for (let gridCol of gridRow) {
      for (let [tileRowId, tileRow] of gridCol.grid.entries()) {
        combinedGrid[gridRowId] ??= []
        combinedGrid[gridRowId][tileRowId] ??= []
        combinedGrid[gridRowId][tileRowId].push(...tileRow)
      }
    }
  }

  let board = new Tile(combinedGrid.flat())

  let boardWidth = board.grid[0].length
  let boardHeight = board.grid.length
  let monsterWidth = MONSTER[0].length
  let monsterHeight = MONSTER.length

  for (let _ of variants(board)) {
    let hasMonster = false
    for (let row = monsterHeight; row < boardHeight; row++) {
      for (let col = 0; col < boardWidth - monsterWidth; col++) {
        let found = true
        for (let y = 0; y < monsterHeight; y++) {
          for (let x = 0; x < monsterWidth; x++) {
            if (MONSTER[y][x] === '#' && board.grid[row - monsterHeight + y][col + x] !== '#') {
              found = false
              break
            }
          }
        }

        if (found) {
          hasMonster = true
          for (let y = 0; y < monsterHeight; y++) {
            for (let x = 0; x < monsterWidth; x++) {
              if (MONSTER[y][x] === '#') board.grid[row - monsterHeight + y][col + x] = '0'
            }
          }
        }
      }
    }

    // We found a monsteeeeeer, aaargh!
    if (hasMonster) break
  }

  // Count the hashes
  let hashes = 0
  for (let row of board.grid) {
    for (let symbol of row) {
      if (symbol === '#') hashes++
    }
  }

  return hashes
}

class Tile {
  constructor(grid) {
    this.grid = grid
  }
  rotate() {
    this.grid = this.grid[0].map((_, col) =>
      this.grid
        .map((row) => row[col])
        .slice()
        .reverse(),
    )
    return this
  }
  flip() {
    this.grid = this.grid.map((line) => line.slice().reverse())
    return this
  }
  top() {
    return this.grid[0].join('')
  }
  right() {
    return this.grid.map((row) => row[row.length - 1]).join('')
  }
  bottom() {
    return this.grid[this.grid.length - 1].join('')
  }
  left() {
    return this.grid.map((row) => row[0]).join('')
  }
  edges() {
    return new Set([this.top(), this.right(), this.bottom(), this.left()])
  }
  flippedEdges() {
    return new Set(Array.from(this.edges()).map((edge) => edge.split('').reverse().join('')))
  }
  matches(other) {
    for (let edge of this.edges()) {
      if (other.edges().has(edge) || other.flippedEdges().has(edge)) return true
    }

    return false
  }
}
