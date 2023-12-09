import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-11.txt'), 'utf8')
let test1 = `
11111
19991
19191
19991
11111
`
let test2 = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`

describe('Part 1', () => {
  it.each(
    [
      [test1, 9, 2],
      [test2, 204, 10],
      [test2, 1656, 100],
    ].slice(1, 2)
  )('should produce the correct value for example %#', (input, expected, steps) => {
    expect(part1(input, steps)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`1729`)
  })
})

describe('Part 2', () => {
  it.each([[test2, 195]])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`237`)
  })
})
