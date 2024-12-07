// Day 12: The N-Body Problem

import { range, sum } from '../utils'

// 1. Update velocity by applying gravity
// 2. Once all velocities have been updated for each moon, apply gravity

function totalEnergy(input, steps = 0) {
  let moons = calculateMoonState(input, steps)

  return moons.reduce((total, moon) => {
    return (
      total +
      sum(Object.values(moon.position).map(Math.abs)) *
        sum(Object.values(moon.velocity).map(Math.abs))
    )
  }, 0)
}

function render(input, steps = 0) {
  return display(calculateMoonState(input, steps))
}

function calculateMoonState(input, steps = 0) {
  let moons = parseInput(input)

  for (let _ in range(steps)) {
    let pairs = new WeakMap()

    // Ensure each moon has a key in the pairs map
    for (let moon of moons) {
      pairs.set(moon, [])
    }

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

        // Compare x
        let diff_x = Math.sign(moon2.position.x - moon1.position.x)
        moon1.velocity.x += diff_x
        moon2.velocity.x += -diff_x

        // Compare y
        let diff_y = Math.sign(moon2.position.y - moon1.position.y)
        moon1.velocity.y += diff_y
        moon2.velocity.y += -diff_y

        // Compare z
        let diff_z = Math.sign(moon2.position.z - moon1.position.z)
        moon1.velocity.z += diff_z
        moon2.velocity.z += -diff_z
      }
    }

    // Apply gravity
    for (let moon of moons) {
      moon.position.x += moon.velocity.x
      moon.position.y += moon.velocity.y
      moon.position.z += moon.velocity.z
    }
  }

  return moons
}

function parseInput(input) {
  return input.split('\n').map((moon) => {
    let position = moon
      .slice(1, -1)
      .split(', ')
      .reduce((info, part) => {
        let [key, value] = part.split('=')
        info[key] = Number(value)
        return info
      }, {})

    return { position, velocity: { x: 0, y: 0, z: 0 } }
  })
}

function display(moons) {
  let padding = moons.reduce(
    ({ position, velocity }, moon) => ({
      position: {
        x: Math.max(position.x, moon.position.x.toString().length),
        y: Math.max(position.y, moon.position.y.toString().length),
        z: Math.max(position.z, moon.position.z.toString().length),
      },
      velocity: {
        x: Math.max(velocity.x, moon.velocity.x.toString().length),
        y: Math.max(velocity.y, moon.velocity.y.toString().length),
        z: Math.max(velocity.z, moon.velocity.z.toString().length),
      },
    }),
    { position: { x: 2, y: 2, z: 2 }, velocity: { x: 2, y: 2, z: 2 } }
  )

  let map = {
    pos: 'position',
    vel: 'velocity',
  }

  return moons
    .map((moon) => {
      return Object.entries(map)
        .map(([label, prop]) => {
          let details = Object.keys(moon[prop])
            .map((key) => {
              let value = moon[prop][key]
              return [key, value.toString().padStart(padding[prop][key], ' ')].join('=')
            })
            .join(', ')
          return [label, `<${details}>`].join('=')
        })
        .join(', ')
    })
    .join('\n')
}

export default { totalEnergy, render }
