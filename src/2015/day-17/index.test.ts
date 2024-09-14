import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2015-17.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        20
        15
        10
        5
        5
      `,
      4,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 25)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('1638')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        20
        15
        10
        5
        5
      `,
      3,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 25)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('17')
  })
})
