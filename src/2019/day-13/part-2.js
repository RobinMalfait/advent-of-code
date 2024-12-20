// Day 13: Care Package

import { createIntcodeComputer } from '../intcode/computer'
import { match } from '../utils'

const TILES = {
  EMPTY: 0,
  WALL: 1,
  BLOCK: 2,
  PADDLE: 3,
  BALL: 4,
}

const ACTION = {
  SET_X: 0,
  SET_Y: 1,
  DRAW: 2,
}

const DRAW = {
  SCORE: true,
  TILE: false,
}

export default async function arcadeCabinet(program) {
  let modified_program = program.split(',')

  modified_program[0] = 2 // Set it to 2 to play for free.

  let computer = createIntcodeComputer(modified_program.join(','))

  let state = {
    score: 0,
    ball: { x: 0, y: 0 },
    paddle: { x: 0, y: 0 },

    tmp: { x: 0, y: 0 },
  }

  let DRAW_TILE_HANDLERS = {
    [TILES.EMPTY]: () => {},
    [TILES.WALL]: () => {},
    [TILES.BLOCK]: () => {},
    [TILES.BALL]() {
      state.ball.x = state.tmp.x
      state.ball.y = state.tmp.y

      computer.input(Math.sign(state.ball.x - state.paddle.x))
    },
    [TILES.PADDLE]() {
      state.paddle.x = state.tmp.x
      state.paddle.y = state.tmp.y
    },
  }

  let DRAW_HANDLERS = {
    [DRAW.SCORE](value) {
      state.score = value
    },
    [DRAW.TILE](value) {
      match(value, DRAW_TILE_HANDLERS)
    },
  }

  let ACTION_HANDLERS = {
    [ACTION.SET_X](value) {
      state.tmp.x = value
    },
    [ACTION.SET_Y](value) {
      state.tmp.y = value
    },
    [ACTION.DRAW](value) {
      match(state.tmp.x === -1 && state.tmp.y === 0, DRAW_HANDLERS, value)
    },
  }

  // Let's see what we get
  computer.output((value, index) => {
    match(index % 3, ACTION_HANDLERS, value)
  })

  // Run the computer
  await computer.run()

  // How many blocks tiles are on the screen?
  return state.score
}
