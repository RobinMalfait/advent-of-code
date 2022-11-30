import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2020-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [['35', '20', '15', '25', '47', '40', '62', '55', '65', '95', '102', '117', '150', '182', '127', '219', '299', '277', '309', '576'].join('\n'), 127],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 5)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data, 25)).toMatchInlineSnapshot(`257342611`)
  })
})

describe('Part 2', () => {
  it.each([
    [['35', '20', '15', '25', '47', '40', '62', '55', '65', '95', '102', '117', '150', '182', '127', '219', '299', '277', '309', '576'].join('\n'), 62],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 5)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data, 25)).toMatchInlineSnapshot(`35602097`)
  })
})
