import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-01.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
       199
       200
       208
       210
       200
       207
       240
       269
       260
       263
      `,
      7,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('1696')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
       199
       200
       208
       210
       200
       207
       240
       269
       260
       263
      `,
      5,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('1737')
  })
})
