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
  SET_TILE: 2,
}

export default async function arcadeCabinet(program) {
  let painted_tiles = new Map()
  let computer = createIntcodeComputer(program)
  let position = { x: 0, y: 0 }

  let ACTION_HANDLERS = {
    [ACTION.SET_X](value) {
      position.x = value
    },
    [ACTION.SET_Y](value) {
      position.y = value
    },
    [ACTION.SET_TILE](value) {
      painted_tiles.set(point(position.x, position.y), value)
    },
  }

  // Let's see what we get
  computer.output((value, index) => {
    match(index % 3, ACTION_HANDLERS, value)
  })

  // Run the computer
  await computer.run()

  // How many blocks tiles are on the screen?
  return [...painted_tiles.values()].filter((tile) => tile === TILES.BLOCK).length
}

function point(x, y) {
  return `(${x}, ${y})`
}
