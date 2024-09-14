// Day 24: Planet of Discord

const { sum, table, range } = require('../utils')

const BUG = '#'
const EMPTY = '.'

module.exports = async (input, minutes) => {
  let board = input.split('\n').map((row) => row.split(''))
  const width = board.length
  const height = board[0].length

  const levels = generateLevels(minutes, board, width, height)
  console.log('levels:', levels)

  for (let i = 0; i < minutes; i++) {
    board = produce(board)
  }

  const flat = board.flat(Number.POSITIVE_INFINITY).join('')
  return (flat.match(/\#/g) || []).length
}

function generateLevels(minutes, board, width, height) {
  const levels = range(minutes).reduce((levels, v, index) => {
    let level = index - minutes / 2
    if (level >= 0) {
      level++
    }
    const board = range(height).map((y) =>
      range(width).map((x) => {
        return y === ((width / 2) | 0) && x === ((height / 2) | 0) ? '?' : EMPTY
      })
    )

    return {
      ...levels,
      [level]: board,
    }
  }, {})

  // Set the starting board at depth = 0
  levels[0] = board
  return levels
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
