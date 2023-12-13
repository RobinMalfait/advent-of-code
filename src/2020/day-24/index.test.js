import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let sample = promises.readFile(
  resolve(__dirname, '..', '..', '..', 'data', '2020-24.sample.txt'),
  'utf8'
)
let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-24.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[sample, 10]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part1(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`346`)
  })
})

describe('Part 2', () => {
  it.each([
    [1, 15],
    [2, 12],
    [3, 25],
    [4, 14],
    [5, 23],
    [6, 28],
    [7, 41],
    [8, 37],
    [9, 49],
    [10, 37],
    [20, 132],
    [30, 259],
    [40, 406],
    [50, 566],
    [60, 788],
    [70, 1106],
    [80, 1373],
    [90, 1844],
    [100, 2208],
  ])('should produce the correct value for example %#', async (days, expected) => {
    expect(part2(await sample, days)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`3802`)
  })
})
