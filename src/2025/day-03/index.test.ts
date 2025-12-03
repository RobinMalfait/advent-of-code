import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2025-03.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        987654321111111
        811111111111119
        234234234234278
        818181911112111
      `,
      357,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"17535"`)
  })
})

describe('Part 2', () => {
  it.each([
    ['987654321111111', 987654321111],
    ['811111111111119', 811111111119],
    ['234234234234278', 434234234278],
    ['818181911112111', 888911112111],
    [
      `
        987654321111111
        811111111111119
        234234234234278
        818181911112111
      `,
      3121910778619,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"173577199527257"`)
  })
})
