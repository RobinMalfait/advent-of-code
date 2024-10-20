// Day 10: Monitoring Station
import _ from 'lodash'
import { distance, table } from '../utils'

import part1 from './part-1'

const ASTEROID = '#'

function angle(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
}

function point(x, y) {
  return `(${x}, ${y})`
}

function toCoords(point) {
  const [x, y] = point
    .replace(/(\(|\))*/g, '')
    .split(',')
    .map(Number)
  return { x, y }
}

function findVaporizedAsteroid(input, number) {
  const monitoring_asteroid_position = part1.sensorBoost(input).position
  const { x, y } = toCoords(monitoring_asteroid_position)

  const grid = input.split('\n').map((row) => row.split(''))
  const vaporized_positions = []

  grid.forEach((row, y1) => {
    row.forEach((cell, x1) => {
      // Skip non asteroids
      if (cell !== ASTEROID) {
        return
      }

      // Position of current asteroid
      const position = point(x1, y1)

      // Skip myself
      if (monitoring_asteroid_position === position) {
        return
      }

      // Add some information about this asteroid
      vaporized_positions.push({
        id: position,

        // Position in the system
        position: { x: x1, y: y1 },

        // Angle from the monitoring asteroid
        angle: angle(x, y, x1, y1),

        // Distance from the monitoring asteroid
        distance: distance([x, y], [x1, y1]),
      })
    })
  })

  const grouped = vaporized_positions
    .map((asteroid) => {
      // UP - angle of -90
      // LEFT - angle of 180
      // DOWN - angle of 90
      // RIGHT - angle of 0

      // Normalizing angle so that "UP" is angle of 0
      asteroid.angle += 90
      if (asteroid.angle < 0) {
        asteroid.angle += 360
      }
      return asteroid
    })
    .sort((a, b) => {
      // Sort by angle, then by distance
      const angle = Math.sign(a.angle - b.angle)
      const distance = Math.sign(a.distance - b.distance)
      return angle === 0 ? distance : angle
    })
    .reduce((grouped, current) => {
      // Group asteroids for the same angle together
      const group = grouped[current.angle] || []
      return { ...grouped, [current.angle]: [...group, current] }
    }, {})

  // Create two dimensional array of asteroids
  const values = Object.entries(grouped)
    .sort(([a], [b]) => Math.sign(Number(a) - Number(b)))
    .map(([key, values]) => values)

  // Zip asteroids together, this will take the first asteroid from the first
  // array, the first array of the second and so on. It will go on in loops.
  const woven = _.zip(...values).flat(Number.POSITIVE_INFINITY)

  // Find the asteroid at position n
  const asteroid_n = woven[number - 1]

  // Do the math
  return asteroid_n.position.x * 100 + asteroid_n.position.y
}

// For nice debugging purposes
function visualize(input) {
  if (Array.isArray(input)) {
    console.log(table(input))
  } else {
    console.log(table(input.split('\n').map((row) => row.split(''))))
  }
}

export default { findVaporizedAsteroid, visualize }
