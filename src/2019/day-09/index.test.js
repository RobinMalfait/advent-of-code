import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2019-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    // Takes no input and produces a copy of itself as output. (See:
    // https://en.wikipedia.org/wiki/Quine_(computing))
    [
      '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99',
      [109, 1, 204, -1, 1001, 100, 1, 100, 1008, 100, 16, 101, 1006, 101, 0, 99],
    ],

    // Example provided by @docd27!
    [
      '1101,5,0,116,1101,10,0,117,1101,15,0,118,1101,20,0,119,1101,25,0,120,1101,30,0,121,1001,116,0,113,4,113,1001,117,0,113,4,113,1101,4,0,114,9,114,1201,116,0,113,1002,114,-1,146,9,146,4,113,4,114,1101,123,0,113,9,114,21001,113,0,116,1002,114,-1,146,9,146,1101,0,0,113,1001,120,0,113,4,113,4,114,1101,5,0,114,9,114,21101,256,0,116,1002,114,-1,146,9,146,1101,0,0,113,1001,121,0,113,4,114,4,113,99,0,0,30',
      [5, 10, 25, 4, 123, 4, 5, 256],
    ],

    // Should output a 16-digit number
    ['1102,34915192,34915192,7,4,7,99,0', [1219070632396864]],

    // Should output the large number in the middle
    ['104,1125899906842624,99', [1125899906842624]],
  ])('An input of %s requires an output of "%s"', async (program, output) => {
    expect(await part1(program)).toEqual(output)
  })

  it('should be the identity function', async () => {
    expect(await part1('109,19,3,-15,204,-34,99', [123])).toEqual([123])
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(await part1(await data, [1])).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(await part1(await data, [2])).toMatchSnapshot()
  })
})
