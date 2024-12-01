import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2022-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2
      `,
      13,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('6023')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2
      `,
      1,
    ],
    [
      `
        R 5
        U 8
        L 8
        D 3
        R 17
        D 10
        L 25
        U 20
      `,
      36,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('2533')
  })
})
