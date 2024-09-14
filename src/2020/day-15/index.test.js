import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-15.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['0,3,6', 436],
    ['1,3,2', 1],
    ['2,1,3', 10],
    ['1,2,3', 27],
    ['2,3,1', 78],
    ['3,2,1', 438],
    ['3,1,2', 1836],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('595')
  })
})

describe('Part 2', () => {
  it.skip.each([
    ['0,3,6', 175594],
    ['1,3,2', 2578],
    ['2,1,3', 3544142],
    ['1,2,3', 261214],
    ['2,3,1', 6895259],
    ['3,2,1', 18],
    ['3,1,2', 362],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('1708310')
  })
})
