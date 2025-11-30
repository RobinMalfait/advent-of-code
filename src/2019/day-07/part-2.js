// Day 7: Amplification Circuit

import { permutations } from '../utils'

import { createIntcodeComputer } from '../intcode/computer'

export default function amplification(program, amplifier_config) {
  let amplifiers = amplifier_config.split(',').map(Number)

  let configs = permutations(amplifiers)

  return configs.reduce(async (previous_result, amplifiers) => {
    let prev = await previous_result
    let result = await calculateAmplifierOutput(program, amplifiers)
    return result > prev ? result : prev
  }, Number.NEGATIVE_INFINITY)
}

async function calculateAmplifierOutput(program, amplifiers) {
  let [a, b, c, d, e] = amplifiers

  let [amplifierA, amplifierB, amplifierC, amplifierD, amplifierE] = amplifiers.map(() =>
    createIntcodeComputer(program),
  )

  // Feed some input
  amplifierA.input(a, 0)
  amplifierB.input(b)
  amplifierC.input(c)
  amplifierD.input(d)
  amplifierE.input(e)

  // Do the wiring
  amplifierA.output((value) => amplifierB.input(value))
  amplifierB.output((value) => amplifierC.input(value))
  amplifierC.output((value) => amplifierD.input(value))
  amplifierD.output((value) => amplifierE.input(value))
  amplifierE.output((value) => amplifierA.input(value))

  // Let's run!
  let values = await Promise.all([
    amplifierA.run(),
    amplifierB.run(),
    amplifierC.run(),
    amplifierD.run(),
    amplifierE.run(),
  ])

  // Get the last output of amplifierE
  return values[values.length - 1].slice().pop()
}
