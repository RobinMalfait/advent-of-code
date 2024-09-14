// Day 2: 1202 Program Alarm

import { abort, aborted, match } from '../utils'

export default function gravityAssist(input = '', noun = undefined, verb = undefined) {
  const memory = input.split(',').map(Number)

  if (noun) {
    memory[1] = noun
  }

  if (verb) {
    memory[2] = verb
  }

  try {
    let instruction_pointer = 0
    while (instruction_pointer < memory.length) {
      const operation = memory[instruction_pointer]

      match(operation, {
        [99]: () => abort(),
        [1]() {
          const param1 = memory[memory[instruction_pointer + 1]]
          const param2 = memory[memory[instruction_pointer + 2]]
          const target_param = memory[instruction_pointer + 3]

          instruction_pointer += 4

          memory[target_param] = param1 + param2
        },
        [2]() {
          const param1 = memory[memory[instruction_pointer + 1]]
          const param2 = memory[memory[instruction_pointer + 2]]
          const target_param = memory[instruction_pointer + 3]

          instruction_pointer += 4

          memory[target_param] = param1 * param2
        },
      })
    }
  } catch (err) {
    if (!aborted(err)) {
      console.log('err:', err)
    }
  }

  return memory
}
