// Day 15: Oxygen System

const { createIntcodeComputer } = require('../intcode/computer')
const { match, range, compactTable } = require('../utils')

const MOVEMENT = { NORTH: 1, SOUTH: 2, WEST: 3, EAST: 4 }
const STATUS_CODES = {
  HIT_A_WALL: 0,
  STEPPED_IN_REQUESTED_DIRECTION: 1,
  FOUND_OXYGEN_SYSTEM: 2,
}
const DRAW = {
  DROID: 'D',
  WALL: '#',
  PATH: '.',
  OXYGEN_SYSTEM: 'O',
  UNKNOWN: ' ',
  SURROGATE_WALL: '|',
}

module.exports = async function oxygenSystem(program) {
  const computer = createIntcodeComputer(program)

  const state = {
    // Keep track of the position of the droid
    droid: { x: 0, y: 0 },

    // Keep track of the possible next position
    next_position: { x: 0, y: 0 },

    // Keep track of the full board
    board: new Map(),

    // Keep track of neighbour states
    neighbours: new Map(),

    // Keep track of fake walls
    surrogate_walls: new Set(),

    // Keep track of a queue to try next
    queue: [],

    // Keep track of paths that we explored
    explored: new Set(),
  }

  // We start at a path that is traversable
  state.board.set(point(state.droid.x, state.droid.y), DRAW.PATH)
  state.queue.push(point(state.droid.x, state.droid.y))

  function tryToMove() {
    if (state.queue.length === 0) {
      throw new Error('Did not find the oxygen system :(')
    }

    // Mark the node as being explored
    state.explored.add(state.queue.pop())

    const neighbours = [
      { x: 0, y: -1, movement: MOVEMENT.NORTH },
      { x: 0, y: 1, movement: MOVEMENT.SOUTH },
      { x: -1, y: 0, movement: MOVEMENT.WEST },
      { x: 0, y: 1, movement: MOVEMENT.EAST },
    ]

    // Make neighbors explorable?
    neighbours.forEach(({ x, y, movement }) => {
      const next_x = state.next_position.x + x
      const next_y = state.next_position.y + y
      const neighbor = point(next_x, next_y)
      if (canMove(state, movement)) {
        state.queue.unshift(neighbor)
      }
    })

    // Prefer "Free" slots over existing paths
    const next_free_spot = neighbours.find((n) => canMove(state, n.movement, [DRAW.WALL, DRAW.PATH]))
    if (next_free_spot !== undefined) {
      computer.input(move(next_free_spot.movement))
      return
    }

    // Otherwise, just find the next existing path to move to
    computer.input(move(neighbours.find(({ movement }) => canMove(state, movement)).movement))
  }

  function move(movement) {
    match(movement, {
      [MOVEMENT.NORTH]() {
        state.next_position.y -= 1
      },
      [MOVEMENT.SOUTH]() {
        state.next_position.y += 1
      },
      [MOVEMENT.WEST]() {
        state.next_position.x -= 1
      },
      [MOVEMENT.EAST]() {
        state.next_position.x += 1
      },
    })

    return movement
  }

  computer.output((value) => {
    const next = point(state.next_position.x, state.next_position.y)
    match(value, {
      [STATUS_CODES.HIT_A_WALL]() {
        // Hit a wall, mark position as a WALL
        state.board.set(next, DRAW.WALL)

        const current = point(state.droid.x, state.droid.y)
        if (!state.neighbours.has(current)) {
          state.neighbours.set(current, new Set())
        }
        state.neighbours.get(current).add(next)

        // Hit a wall, let's reset the tmp position
        state.next_position.x = state.droid.x
        state.next_position.y = state.droid.y
      },
      [STATUS_CODES.STEPPED_IN_REQUESTED_DIRECTION]() {
        // Mark the position as a valid PATH
        state.board.set(next, DRAW.PATH)

        // Update the droid's position to the next path
        state.droid.x = state.next_position.x
        state.droid.y = state.next_position.y
      },
      [STATUS_CODES.FOUND_OXYGEN_SYSTEM]() {
        // Mark the position as a valid destination
        state.board.set(next, DRAW.OXYGEN_SYSTEM)

        // Update the droid's position to the final path
        state.droid.x = state.next_position.x
        state.droid.y = state.next_position.y

        // Let's visualize the board
        // visualize(state.board, state.droid, state.surrogate_walls);

        // Found it, let's halt the computer
        computer.halt()
      },
    })

    // Link neighbours for current point
    const neighbours = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
    ]
    neighbours.forEach(({ x, y }) => {
      const p = point(state.droid.x + x, state.droid.y + y)
      if ((state.board.has(p) && state.board.get(p) === DRAW.WALL) || state.surrogate_walls.has(p)) {
        const current = point(state.droid.x, state.droid.y)

        if (!state.neighbours.has(current)) {
          state.neighbours.set(current, new Set())
        }
        state.neighbours.get(current).add(p)

        if (state.neighbours.get(current).size === 3) {
          state.surrogate_walls.add(point(state.droid.x, state.droid.y))
        }
      }
    })

    // Let's try to move again
    tryToMove()
  })

  // Let's try to move
  tryToMove()

  await computer.run()
  return [...state.board.entries()].filter(([position, tile]) => {
    if (state.surrogate_walls.has(position)) {
      return false
    }

    return tile === DRAW.PATH
  }).length
}

function point(x, y) {
  return `(${x}, ${y})`
}

function fromPoint(point) {
  const [x, y] = point.slice(1, -1).split(', ').map(Number)

  return { x, y }
}

function canMove(state, movement, disallowed_tiles = [DRAW.WALL]) {
  const { x = 0, y = 0 } = match(movement, {
    [MOVEMENT.NORTH]: () => ({ y: -1 }),
    [MOVEMENT.SOUTH]: () => ({ y: 1 }),
    [MOVEMENT.WEST]: () => ({ x: -1 }),
    [MOVEMENT.EAST]: () => ({ x: 1 }),
  })

  const next = point(state.next_position.x + x, state.next_position.y + y)

  // Check if we are not walking on a possible dead end
  if (state.surrogate_walls.has(next)) {
    return false
  }

  return !disallowed_tiles.includes(state.board.get(next))
}

function visualize(board, droid, surrogate_walls = []) {
  const offset = {
    LEFT: 0,
    RIGHT: 0,
    TOP: 0,
    BOTTOM: 0,
  }

  // Find the board offsets
  ;[...board.keys()].forEach((position) => {
    const { x, y } = fromPoint(position)
    offset.LEFT = Math.min(offset.LEFT, x)
    offset.RIGHT = Math.max(offset.RIGHT, x)
    offset.TOP = Math.min(offset.TOP, y)
    offset.BOTTOM = Math.max(offset.BOTTOM, y)
  })

  const LEFT_OFFSET = Math.abs(offset.LEFT)
  const TOP_OFFSET = Math.abs(offset.TOP)

  const width = LEFT_OFFSET + Math.abs(offset.RIGHT) + 1
  const height = TOP_OFFSET + Math.abs(offset.BOTTOM) + 1

  // Create an empty board
  const visual_board = range(height).map(() => range(width).map(() => DRAW.UNKNOWN))

  // Fill in the board
  ;[...board.entries()].forEach(([position, tile]) => {
    const { x, y } = fromPoint(position)
    visual_board[y + TOP_OFFSET][x + LEFT_OFFSET] = tile
  })

  // Display the start position
  visual_board[0 + TOP_OFFSET][0 + LEFT_OFFSET] = 'S'

  // Surrogate walls?
  surrogate_walls.forEach((value) => {
    const { x, y } = fromPoint(value)
    visual_board[y + TOP_OFFSET][x + LEFT_OFFSET] = DRAW.SURROGATE_WALL
  })

  // Set the droid
  visual_board[droid.y + TOP_OFFSET][droid.x + LEFT_OFFSET] = DRAW.DROID

  // Apply a border of padding
  visual_board.unshift(range(width).map(() => ' '))
  visual_board.push(range(width).map(() => ' '))
  visual_board.forEach((row) => {
    row.push(' ')
    row.unshift(' ')
  })

  // Draw
  return compactTable(visual_board)
}
