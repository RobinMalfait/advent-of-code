import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2020-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      [
        '35',
        '20',
        '15',
        '25',
        '47',
        '40',
        '62',
        '55',
        '65',
        '95',
        '102',
        '117',
        '150',
        '182',
        '127',
        '219',
        '299',
        '277',
        '309',
        '576',
      ].join('\n'),
      127,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 5)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data, 25)).toMatchInlineSnapshot('257342611')
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        '35',
        '20',
        '15',
        '25',
        '47',
        '40',
        '62',
        '55',
        '65',
        '95',
        '102',
        '117',
        '150',
        '182',
        '127',
        '219',
        '299',
        '277',
        '309',
        '576',
      ].join('\n'),
      62,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 5)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data, 25)).toMatchInlineSnapshot('35602097')
  })
})
