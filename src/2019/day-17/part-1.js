// Day 17: Set and Forget

import { createIntcodeComputer } from '../intcode/computer'

export default async function ASCII(input) {
  const computer = createIntcodeComputer(input)
  let buffer = ''
  computer.output((value) => {
    buffer += String.fromCharCode(value)
  })

  await computer.run()

  const positions = new Map()
  const board = buffer.split('\n')

  // Let's create a positions maps
  board.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      positions.set(point(x, y), cell)
    })
  })

  const neighbours = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
  ]

  // Find all intersections
  return [...positions.entries()].reduce((total, [position, tile]) => {
    if (tile !== '#') {
      return total
    }

    const me = fromPoint(position)
    const surrounded_by_hashtags = neighbours.every(({ x, y }) => {
      const neighbour_position = point(me.x + x, me.y + y)
      return positions.has(neighbour_position) && positions.get(neighbour_position) === '#'
    })

    return surrounded_by_hashtags ? total + me.x * me.y : total
  }, 0)
}

function point(x, y) {
  return `(${x}, ${y})`
}

function fromPoint(point) {
  const [x, y] = point.slice(1, -1).split(', ').map(Number)

  return { x, y }
}
