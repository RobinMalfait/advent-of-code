import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2024-21.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        029A
        980A
        179A
        456A
        379A
      `,
      126_384,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"238078"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        029A
        980A
        179A
        456A
        379A
      `,
      154_115_708_116_294,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"293919502998014"`)
  })
})
