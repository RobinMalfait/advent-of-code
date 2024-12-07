// Day 9: Sensor Boost

import { createIntcodeComputer } from '../intcode/computer'

export default function sensorBoost(program, input = []) {
  let computer = createIntcodeComputer(program)

  computer.input(input)

  return computer.run()
}
