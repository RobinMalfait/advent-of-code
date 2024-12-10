import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2024-10.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        89010123
        78121874
        87430965
        96549874
        45678903
        32019012
        01329801
        10456732
      `,
      36,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"778"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        89010123
        78121874
        87430965
        96549874
        45678903
        32019012
        01329801
        10456732
      `,
      81,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"1925"`)
  })
})
