// Day 10: Monitoring Station

import { table } from '../utils'

const ASTEROID = '#'

function angle(x1, y1, x2, y2) {
  return (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
}

function sensorBoost(input) {
  const grid = input.split('\n').map((row) => row.split(''))

  const hash = new Map()

  grid.forEach((row, y) => {
    row.forEach((cell, x) => {
      // Skip non asteroids
      if (cell !== ASTEROID) {
        return
      }

      // Store all the angles for this position, use a Set to provide
      // uniqueness. Each asteroid inline will have the exact same angle and
      // thus only stored once!
      const position = point(x, y)
      hash.set(position, new Set([]))

      grid.forEach((row2, y1) => {
        row2.forEach((cell2, x1) => {
          // Skip non-asteroids
          if (cell2 !== ASTEROID) {
            return
          }

          // Skip myself
          if (point(x1, y1) === position) {
            return
          }

          // Store the angle
          hash.get(position).add(angle(x, y, x1, y1))
        })
      })
    })
  })

  // Mutating in place 😎 converting each set just to its size, so that we know
  // how many asteroids are visible from a certain asteroid
  hash.forEach((value, key) => hash.set(key, value.size))

  // Sort the asteroids to how many they can see, take the first value because
  // that's the highest one!
  const [[position, visible_asteroids]] = [...hash.entries()].sort(([, a], [, b]) =>
    Math.sign(b - a)
  )
  return { position, visible_asteroids }
}

function point(x, y) {
  return `(${x}, ${y})`
}

// For nice debugging reasons
function visualize(input) {
  console.log(table(input.split('\n').map((row) => row.split(''))))
}

export default { sensorBoost, visualize }
