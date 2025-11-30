// Day 24: Planet of Discord

import { sum } from '../utils'

const BUG = '#'
const EMPTY = '.'

export default async (input) => {
  let board = input.split('\n').map((row) => row.split(''))

  let history = [input]

  for (let i = 0; i < 1e3; i++) {
    let next_board = produce(board)
    let flat = next_board.map((r) => r.join('')).join('')

    if (history.includes(flat)) {
      board = next_board
      break
    }

    history.push(flat)
    board = next_board
  }

  let flat = board.flat(Number.POSITIVE_INFINITY)
  return sum(
    flat
      .map((tile, i) => ({ tile, i }))
      .filter((thing) => thing.tile === BUG)
      .map(({ i }) => 2 ** i),
  )
}

const neighbours = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function produce(board) {
  let next_board = []
  for (let y = 0; y < board.length; y++) {
    next_board[y] = []
    for (let x = 0; x < board[y].length; x++) {
      // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
      // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
      let surrounding_tiles = neighbours
        .map(([xD, yD]) => {
          let posX = x + xD
          let posY = y + yD
          if (posX < 0 || posY < 0 || posX > board.length - 1 || posY > board.length - 1) {
            return EMPTY
          }
          return board[posY][posX]
        })
        .join('')

      let me = board[y][x]
      let BUG_NEIGHBOURS = (surrounding_tiles.match(/\#/g) || []).length

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
