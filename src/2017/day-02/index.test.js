import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2017-02.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([
    // Example one
    [
      // Input
      ['5 1 9 5', '7 5 3', '2 4 6 8'].join('\n'),

      // Output
      18,
    ],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('46402')
  })
})

describe('Part 2', () => {
  // Part 2
  it.each([
    // Example one
    [
      ['5 9 2 8', '9 4 7 3', '3 8 6 5'].join('\n'),
      // Output
      9,
    ],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('265')
  })
})
