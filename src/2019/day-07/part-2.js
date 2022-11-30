// Day 7: Amplification Circuit

const { permutations } = require('../utils')

const { createIntcodeComputer } = require('../intcode/computer')

module.exports = function amplification(program, amplifier_config) {
  const amplifiers = amplifier_config.split(',').map(Number)

  const configs = permutations(amplifiers)

  return configs.reduce(async (previous_result, amplifiers) => {
    const prev = await previous_result
    const result = await calculateAmplifierOutput(program, amplifiers)
    return result > prev ? result : prev
  }, -Infinity)
}

async function calculateAmplifierOutput(program, amplifiers) {
  const [a, b, c, d, e] = amplifiers

  const [amplifierA, amplifierB, amplifierC, amplifierD, amplifierE] = amplifiers.map(() => createIntcodeComputer(program))

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
  const values = await Promise.all([amplifierA.run(), amplifierB.run(), amplifierC.run(), amplifierD.run(), amplifierE.run()])

  // Get the last output of amplifierE
  return values[values.length - 1].slice().pop()
}
