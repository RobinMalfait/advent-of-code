import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2023-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        0 3 6 9 12 15
      `,
      18,
    ],
    [
      `
        1 3 6 10 15 21
      `,
      28,
    ],
    [
      `
        10 13 16 21 30 45
      `,
      68,
    ],
    [
      `
        0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45
      `,
      114,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('1666172641')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        10  13  16  21  30  45
      `,
      5,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('933')
  })
})
