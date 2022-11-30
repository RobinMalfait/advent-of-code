export default function (blob) {
  let boards = blob.trim().split('\n\n')
  let numbers = boards.shift().split(',').map(Number)
  boards = boards.map((board) => board.split('\n').map((row) => row.trim().split(/\s+/g).map(Number)))

  let state = { winners: [], lastWinningNumber: null }

  for (let number of numbers) {
    for (let [boardIdx, board] of boards.entries()) {
      if (state.winners.includes(boardIdx)) continue

      for (let [rowIdx, row] of board.entries()) {
        board[rowIdx] = row.map((n) => (n === number ? null : n))
      }

      if (hasBingo(board)) {
        state.winners.push(boardIdx)
        state.lastWinningNumber = number
      }
    }
  }

  return state.lastWinningNumber * boards[state.winners.pop()].flat().reduce((total, current) => total + current, 0)
}

function hasBingo(board) {
  for (let row of board) {
    if (row.every((n) => n === null)) return true
  }

  for (let row of transpose(board)) {
    if (row.every((n) => n === null)) return true
  }

  return false
}

function transpose(grid) {
  return grid[0].map((_, i) => grid.map((row) => row[i]))
}
