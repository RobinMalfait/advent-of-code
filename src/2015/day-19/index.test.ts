import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2015-19.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        H => HO
        H => OH
        O => HH

        HOH
      `,
      4,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(String.raw`535`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        e => H
        e => O
        H => HO
        H => OH
        O => HH

        HOH
      `,
      3,
    ],
    [
      `
        e => H
        e => O
        H => HO
        H => OH
        O => HH

        HOHOHO
      `,
      6,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot()
  })
})
