// Day 9: Sensor Boost

const { createIntcodeComputer } = require('../intcode/computer')

module.exports = function sensorBoost(program, input = []) {
  const computer = createIntcodeComputer(program)

  computer.input(input)

  return computer.run()
}
