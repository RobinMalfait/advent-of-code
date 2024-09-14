// Day 7: Amplification Circuit

import { permutations } from '../utils'

import { createIntcodeComputer } from '../intcode/computer'

export default async function amplification(program, amplifier_config) {
  const amplifiers = amplifier_config.split(',').map(Number)

  const configs = permutations(amplifiers)

  return await configs.reduce(async (chain, amplifiers) => {
    const previous_result = await chain
    const result = await calculateAmplifierOutput(program, amplifiers)
    return result > previous_result ? result : previous_result
  }, Number.NEGATIVE_INFINITY)
}

async function calculateAmplifierOutput(program, amplifiers) {
  const result = await amplifiers.reduce(
    async (previous_result, setting) => {
      const computer = createIntcodeComputer(program)
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
