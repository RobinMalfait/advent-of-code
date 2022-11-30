// Day 24: Planet of Discord

const { sum, table } = require('../utils')

const BUG = '#'
const EMPTY = '.'

module.exports = async function (input) {
  let board = input.split('\n').map((row) => row.split(''))

  const history = [input]

  for (let i = 0; i < 1e3; i++) {
    const next_board = produce(board)
    const flat = next_board.map((r) => r.join('')).join('')

    if (history.includes(flat)) {
      board = next_board
      break
    }

    history.push(flat)
    board = next_board
  }

  const flat = board.flat(Infinity)
  return sum(
    flat
      .map((tile, i) => ({ tile, i }))
      .filter((thing) => thing.tile === BUG)
      .map(({ i }) => 2 ** i)
  )
}

const neighbours = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function produce(board) {
  const next_board = []
  for (let y = 0; y < board.length; y++) {
    next_board[y] = []
    for (let x = 0; x < board[y].length; x++) {
      // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
      // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
      const surrounding_tiles = neighbours
        .map(([xD, yD]) => {
          const posX = x + xD
          const posY = y + yD
          if (posX < 0 || posY < 0 || posX > board.length - 1 || posY > board.length - 1) {
            return EMPTY
          }
          return board[posY][posX]
        })
        .join('')

      const me = board[y][x]
      const BUG_NEIGHBOURS = (surrounding_tiles.match(/\#/g) || []).length

      // Default
      next_board[y][x] = me

      if (me === BUG) {
        if (BUG_NEIGHBOURS !== 1) {
          next_board[y][x] = EMPTY
        }
      }

      if (me === EMPTY) {
        if (BUG_NEIGHBOURS === 1 || BUG_NEIGHBOURS === 2) {
          next_board[y][x] = BUG
        }
      }
    }
  }
  return next_board
}
