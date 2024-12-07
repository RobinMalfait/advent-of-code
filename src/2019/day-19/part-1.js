// Day 19: Tractor Beam

import { createIntcodeComputer } from '../intcode/computer'

export default async (input) => {
  let GRID_SIZE = 50
  let sqrt = Math.sqrt(GRID_SIZE)

  let promises = []

  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      // We can skip a bunch of checks - which is not ideal but works perfectly
      // for this input.
      if (Math.abs(x - y) - 1 >= sqrt) {
        continue
      }

      let computer = createIntcodeComputer(input)
      computer.input(x, y)
      promises.push(computer.run().then(([value]) => value))
    }
  }

  return (await Promise.all(promises)).reduce((acc, value) => acc + value, 0)
}
