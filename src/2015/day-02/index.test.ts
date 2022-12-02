import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(process.cwd(), 'data', '2015-02.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['2x3x4', 58],
    ['1x1x10', 43],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`1598415`)
  })
})

describe('Part 2', () => {
  it.each([
    ['2x3x4', 34],
    ['1x1x10', 14],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`3812909`)
  })
})
