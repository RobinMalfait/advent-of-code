import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2025-01.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        L68
        L30
        R48
        L5
        R60
        L55
        L1
        L99
        R14
        L82
      `,
      3,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"1066"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        L68
        L30
        R48
        L5
        R60
        L55
        L1
        L99
        R14
        L82
      `,
      6,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"6223"`)
  })
})
