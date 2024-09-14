// Day 19: Tractor Beam

const { createIntcodeComputer } = require('../intcode/computer')
const { asyncBinarySearch, abort } = require('../utils')

let scanned = 0

function createValue(input) {
  const cache = new Map()

  return async (x, y) => {
    scanned++

    if (scanned % 500 === 0) {
      console.log('Scanned positions:', scanned)
    }

    const key = `${x},${y}`
    if (cache.has(key)) {
      return cache.get(key)
    }

    const computer = createIntcodeComputer(input)
    computer.input(x, y)
    const [value] = await computer.run()
    cache.set(key, value)
    return value
  }
}

async function getTopEdge(x, read) {
  let y = 0

  const last_value = await read(x, 0)
  const direction = last_value === 1 ? 1 : -1

  while ((await read(x, y)) !== last_value) {
    y += direction
  }

  return [x, y - 1]
}

async function getBottomEdge(x, read) {
  let y = 0

  const last_value = await read(x, 0)
  const direction = last_value === 1 ? -1 : 1

  while ((await read(x, y)) !== last_value) {
    y += direction
  }

  return [x, y - 1]
}

async function calculateTopEdgeSlope(read) {
  const [[x1, y1], [x2, y2]] = await Promise.all([getTopEdge(20, read), getTopEdge(100, read)])

  return y2 - y1 / x2 - x1
}

async function calculateBottomEdgeSlope(read) {
  const [[x1, y1], [x2, y2]] = await Promise.all([
    getBottomEdge(20, read),
    getBottomEdge(100, read),
  ])

  return y2 - y1 / x2 - x1
}

module.exports = async (input) => {
  const GRID_SIZE = 100
  const value = createValue(input)

  // Pre-analysis
  const top_edge_slope = await calculateTopEdgeSlope(value)
  const bottom_edge_slope = await calculateBottomEdgeSlope(value)

  const offset = GRID_SIZE
  const guess = GRID_SIZE ** 3

  // to ensure the box * just * fits you also need to check the pixel to the right of the top right is empty, and the pixel to the left of the bottom left is empty
  for (let x = offset; x < guess; x++) {
    for (let y = offset; y < guess; y++) {
      if (x > 1 && y < Math.abs(x * top_edge_slope)) {
        continue
      }

      if (y > 1 && x < Math.abs(y * bottom_edge_slope)) {
        continue
      }

      const [edge_cases, corners] = await Promise.all([
        Promise.all([value(x + GRID_SIZE + 1, y), value(x - 1, y + GRID_SIZE)]),
        Promise.all([
          value(x, y),
          value(x + GRID_SIZE, y),
          value(x, y + GRID_SIZE),
          value(x + GRID_SIZE, y + GRID_SIZE),
        ]),
      ])

      if (
        // Does it fit?
        corners.every((value) => value === 1) &&
        // Does it *just* fit?
        edge_cases.every((value) => value === 0)
      ) {
        return x * 10000 + y
      }
    }
  }
}

// 100010664
// 100010665
