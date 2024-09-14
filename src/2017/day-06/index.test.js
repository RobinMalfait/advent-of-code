import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2017-06.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([[[0, 2, 7, 0].join('\t'), 5]])('%s should result in "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('7864')
  })
})

describe('Part 2', () => {
  // Part 2
  it.each([[[0, 2, 7, 0].join('\t'), 4]])('%s should result in "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('1695')
  })
})
