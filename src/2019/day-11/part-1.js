// Day 11: Space Police

import { createIntcodeComputer } from '../intcode/computer'
import { match } from '../utils'

const COLORS = {
  BLACK: 0,
  WHITE: 1,
}

const TURN = {
  LEFT_90_DEGREES: 0,
  RIGHT_90_DEGREES: 1,
}

const DIRECTION = {
  UP: '^',
  LEFT: '<',
  RIGHT: '>',
  DOWN: 'v',
}

const ACTION = {
  COLOR: 0,
  TURN: 1,
}

export default async function spacePolice(program) {
  const painted_panels_map = new Map()
  const computer = createIntcodeComputer(program)
  const position = { x: 0, y: 0 }
  const state = {
    color: COLORS.BLACK,
    direction: DIRECTION.UP,
  }

  function move(direction, { x = 0, y = 0 } = {}) {
    state.direction = direction
    position.x += x
    position.y += y
  }

  // Let's see what we get
  computer.output((value, index) => {
    match(index % 2, {
      [ACTION.COLOR]() {
        painted_panels_map.set(point(position.x, position.y), value)
        state.color = value
      },
      [ACTION.TURN]() {
        match(state.direction, {
          [DIRECTION.UP]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]: () => move(DIRECTION.LEFT, { x: -1 }),
              [TURN.RIGHT_90_DEGREES]: () => move(DIRECTION.RIGHT, { x: 1 }),
            })
          },
          [DIRECTION.DOWN]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]: () => move(DIRECTION.RIGHT, { x: 1 }),
              [TURN.RIGHT_90_DEGREES]: () => move(DIRECTION.LEFT, { x: -1 }),
            })
          },
          [DIRECTION.LEFT]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]: () => move(DIRECTION.DOWN, { y: 1 }),
              [TURN.RIGHT_90_DEGREES]: () => move(DIRECTION.UP, { y: -1 }),
            })
          },
          [DIRECTION.RIGHT]() {
            match(value, {
              [TURN.LEFT_90_DEGREES]: () => move(DIRECTION.UP, { y: -1 }),
              [TURN.RIGHT_90_DEGREES]: () => move(DIRECTION.DOWN, { y: 1 }),
            })
          },
        })

        // Give the computer the color input again
        const pos = point(position.x, position.y)
        computer.input(painted_panels_map.has(pos) ? painted_panels_map.get(pos) : COLORS.BLACK)
      },
    })
  })

  // Start with giving the computer the current color
  computer.input(state.color)

  // Run the computer
  await computer.run()

  // How many panels did we paint (unique)?
  return painted_panels_map.size
}

function point(x, y) {
  return `(${x}, ${y})`
}
