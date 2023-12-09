import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-10.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['16 10 15 5 1 11 7 19 6 12 4'.split(' ').join('\n'), 7 * 5],
    ['28 33 18 42 31 14 46 20 48 47 24 23 49 45 19 38 39 11 1 32 25 35 8 17 7 9 4 2 34 10 3'.split(' ').join('\n'), 22 * 10],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`2210`)
  })
})

describe('Part 2', () => {
  it.each([
    ['16 10 15 5 1 11 7 19 6 12 4'.split(' ').join('\n'), 8],
    ['28 33 18 42 31 14 46 20 48 47 24 23 49 45 19 38 39 11 1 32 25 35 8 17 7 9 4 2 34 10 3'.split(' ').join('\n'), 19208],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`7086739046912`)
  })
})
