// Day 7: Amplification Circuit

import { permutations } from '../utils'

import { createIntcodeComputer } from '../intcode/computer'

export default async function amplification(program, amplifier_config) {
  let amplifiers = amplifier_config.split(',').map(Number)

  let configs = permutations(amplifiers)

  return await configs.reduce(async (chain, amplifiers) => {
    let previous_result = await chain
    let result = await calculateAmplifierOutput(program, amplifiers)
    return result > previous_result ? result : previous_result
  }, Number.NEGATIVE_INFINITY)
}

async function calculateAmplifierOutput(program, amplifiers) {
  let result = await amplifiers.reduce(
    async (previous_result, setting) => {
      let computer = createIntcodeComputer(program)
      computer.input(setting, await previous_result)
      return computer.run()
    },
    [0]
  )

  if (result.length !== 1) {
    throw new Error(`Our output looks incorrect: ${result}`)
  }

  return result[0]
}
