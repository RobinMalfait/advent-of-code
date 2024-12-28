import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2015-18.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        .#.#.#
        ...##.
        #....#
        ..#...
        #.#..#
        ####..
      `,
      4,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 4)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"821"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        .#.#.#
        ...##.
        #....#
        ..#...
        #.#..#
        ####..
      `,
      17,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 5)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"886"`)
  })
})
