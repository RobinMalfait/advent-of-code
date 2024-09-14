import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2023-06.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        Time:      7  15   30
        Distance:  9  40  200
      `,
      288,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('1660968')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        Time:      7  15   30
        Distance:  9  40  200
      `,
      71503,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('26499773')
  })
})
