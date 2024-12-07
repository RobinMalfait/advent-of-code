// Day 11: Space Police

import { border, process, render, scale } from '../day-08/part-2'
import { createIntcodeComputer } from '../intcode/computer'
import { match, range, table } from '../utils'

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
  let painted_panels_map = new Map()
  let computer = createIntcodeComputer(program)
  let position = { x: 0, y: 0 }
  let state = {
    color: COLORS.WHITE,
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
        let pos = point(position.x, position.y)
        computer.input(painted_panels_map.has(pos) ? painted_panels_map.get(pos) : COLORS.BLACK)
      },
    })
  })

  // Start with giving the computer the current color
  computer.input(state.color)

  // Run the computer
  await computer.run()

  // What did we draw?
  return await visualize(painted_panels_map)
}

function visualize(map) {
  let width = 40 + 1
  let height = 5 + 1
  let data = range(height)
    .map((y) =>
      range(width).map((x) => {
        let position = point(x, y)
        return map.has(position) ? map.get(position) : COLORS.BLACK
      })
    )
    .flat(Number.POSITIVE_INFINITY)
    .join('')

  return process(data, width, height).then(border(1)).then(scale(2)).then(render())
}

function point(x, y) {
  return `(${x}, ${y})`
}
