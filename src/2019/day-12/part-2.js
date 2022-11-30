// Day 12: The N-Body Problem

const { abort, aborted, lcm } = require('../utils')

function stepsToInitialValue(input) {
  return calculateMoonState(parseInput(input))
}

function keyFor(moons, property) {
  return moons
    .map((moon) => [moon.position[property], moon.velocity[property]])
    .flat(Infinity)
    .join(' || ')
}

function calculateMoonState(moons) {
  const x_seen = new Set([keyFor(moons, 'x')])
  const y_seen = new Set([keyFor(moons, 'y')])
  const z_seen = new Set([keyFor(moons, 'z')])

  try {
    while (true) {
      const pairs = new WeakMap()

      // Ensure each moon has a key in the pairs map
      moons.forEach((moon) => pairs.set(moon, []))

      // Apply velocity
      for (let moon1 of moons) {
        for (let moon2 of moons) {
          // Skip if we are comparing ourselves
          if (moon1 === moon2) {
            continue
          }

          // Skip if we already handled this combination of moons
          if (pairs.get(moon1).includes(moon2) || pairs.get(moon2).includes(moon1)) {
            continue
          }

          // Mark that we validated this pair
          pairs.get(moon1).push(moon2)
          pairs.get(moon2).push(moon1)

          // Compare X
          const diff_x = Math.sign(moon2.position.x - moon1.position.x)
          moon1.velocity.x += diff_x
          moon2.velocity.x += -diff_x

          // Compare Y
          const diff_y = Math.sign(moon2.position.y - moon1.position.y)
          moon1.velocity.y += diff_y
          moon2.velocity.y += -diff_y

          // Compare Z
          const diff_z = Math.sign(moon2.position.z - moon1.position.z)
          moon1.velocity.z += diff_z
          moon2.velocity.z += -diff_z
        }
      }

      // Apply gravity
      moons.forEach((moon) => {
        moon.position.x += moon.velocity.x
        moon.position.y += moon.velocity.y
        moon.position.z += moon.velocity.z
      })

      // Check positions for each moon
      const x_positions = keyFor(moons, 'x')
      const y_positions = keyFor(moons, 'y')
      const z_positions = keyFor(moons, 'z')

      // We've seen them all, ABORT
      if (x_seen.has(x_positions) && y_seen.has(y_positions) && z_seen.has(z_positions)) {
        abort()
      }

      // Keep track of the seen positions
      x_seen.add(x_positions)
      y_seen.add(y_positions)
      z_seen.add(z_positions)
    }
  } catch (err) {
    if (aborted(err)) {
      // We aborted, let's find the least common multiplier between all those
      // seen values
      return lcm(lcm(x_seen.size, y_seen.size), z_seen.size)
    }

    throw err
  }
}

function parseInput(input) {
  return input.split('\n').map((moon) => {
    const position = moon
      .slice(1, -1)
      .split(', ')
      .reduce((info, part) => {
        const [key, value] = part.split('=')
        return { ...info, [key]: Number(value) }
      }, {})

    return { position, velocity: { x: 0, y: 0, z: 0 } }
  })
}

module.exports = stepsToInitialValue
