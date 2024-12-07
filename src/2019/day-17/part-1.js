// Day 17: Set and Forget

import { createIntcodeComputer } from '../intcode/computer'

export default async function ASCII(input) {
  let computer = createIntcodeComputer(input)
  let buffer = ''
  computer.output((value) => {
    buffer += String.fromCharCode(value)
  })

  await computer.run()

  let positions = new Map()
  let board = buffer.split('\n')

  // Let's create a positions maps
  board.forEach((row, y) => {
    row.split('').forEach((cell, x) => {
      positions.set(point(x, y), cell)
    })
  })

  let neighbours = [
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

    let me = fromPoint(position)
    let surrounded_by_hashtags = neighbours.every(({ x, y }) => {
      let neighbour_position = point(me.x + x, me.y + y)
      return positions.has(neighbour_position) && positions.get(neighbour_position) === '#'
    })

    return surrounded_by_hashtags ? total + me.x * me.y : total
  }, 0)
}

function point(x, y) {
  return `(${x}, ${y})`
}

function fromPoint(point) {
  let [x, y] = point.slice(1, -1).split(', ').map(Number)

  return { x, y }
}
