import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2019-02.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([
    ['1,0,0,0,99', '2,0,0,0,99'],
    ['2,3,0,3,99', '2,3,0,6,99'],
    ['2,4,4,5,99,0', '2,4,4,5,99,9801'],
    ['1,1,1,4,99,5,6,0,99', '30,1,1,4,2,5,6,0,99'],
  ])('An input of %s requires an output of "%s"', (input, expected) => {
    expect(part1(input).join(',')).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    // Once you have a working computer, the first step is to restore the gravity assist program (your puzzle input) to the "1202 program alarm" state it had just before the last computer caught fire. To do this, before running the program, replace position 1 with the value 12 and replace position 2 with the value 2. What value is left at position 0 after the program halts?
    const noun = 12
    const verb = 2

    const [first_value] = part1(await data, noun, verb)
    expect(first_value).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    const input = await data

    for (var noun = 0; noun < 100; noun++) {
      for (var verb = 0; verb < 100; verb++) {
        const [first_value] = part2(input, noun, verb)
        if (first_value === 19690720) {
          return
        }
      }
    }

    expect(100 * noun + verb).toMatchSnapshot()
  })
})
