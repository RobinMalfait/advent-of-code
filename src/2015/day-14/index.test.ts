import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2015-14.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
        Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
      `,
      1120,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 1000)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data, 2503)).toMatchInlineSnapshot('2660')
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
        Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.
      `,
      689,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 1000)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data, 2503)).toMatchInlineSnapshot('1256')
  })
})
