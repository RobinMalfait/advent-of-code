import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-16.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      [
        'class: 1-3 or 5-7',
        'row: 6-11 or 33-44',
        'seat: 13-40 or 45-50',
        '',
        'your ticket:',
        '7,1,14',
        '',
        'nearby tickets:',
        '7,3,47',
        '40,4,50',
        '55,2,20',
        '38,6,12',
      ].join('\n'),
      4 + 55 + 12,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('20058')
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        'departure class: 0-1 or 4-19',
        'departure row: 0-5 or 8-19',
        'departure seat: 0-13 or 16-19',
        '',
        'your ticket:',
        '11,12,13',
        '',
        'nearby tickets:',
        '3,9,18',
        '15,1,5',
        '5,14,9 ',
      ].join('\n'),
      12 * 11 * 13,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('366871907221')
  })
})
