import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2018-06.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        1, 1
        1, 6
        8, 3
        3, 4
        5, 5
        8, 9
      `,
      17,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('5358')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        1, 1
        1, 6
        8, 3
        3, 4
        5, 5
        8, 9
      `,
      16,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 32)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('37093')
  })
})
