import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2025-05.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        3-5
        10-14
        16-20
        12-18

        1
        5
        8
        11
        17
        32
      `,
      3,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"720"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        3-5
        10-14
        16-20
        12-18

        1
        5
        8
        11
        17
        32
      `,
      14,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"357608232770687"`)
  })
})
