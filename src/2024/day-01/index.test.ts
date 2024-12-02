import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2024-01.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        3   4
        4   3
        2   5
        1   3
        3   9
        3   3
      `,
      11,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`2066446`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        3   4
        4   3
        2   5
        1   3
        3   9
        3   3
      `,
      31,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`24931009`)
  })
})