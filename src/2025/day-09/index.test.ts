import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2025-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        7,1
        11,1
        11,7
        9,7
        9,5
        2,5
        2,3
        7,3
      `,
      50,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"4755429952"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        7,1
        11,1
        11,7
        9,7
        9,5
        2,5
        2,3
        7,3
      `,
      24,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"1429596008"`)
  })
})
