import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2016-08.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        rect 3x2
        rotate column x=1 by 1
        rotate row y=0 by 4
        rotate column x=1 by 1
      `,
      6,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input, 7, 3)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('106')
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`
      "
      ░██░░████░█░░░░████░█░░░░░██░░█░░░█████░░██░░░███░
      █░░█░█░░░░█░░░░█░░░░█░░░░█░░█░█░░░██░░░░█░░█░█░░░░
      █░░░░███░░█░░░░███░░█░░░░█░░█░░█░█░███░░█░░░░█░░░░
      █░░░░█░░░░█░░░░█░░░░█░░░░█░░█░░░█░░█░░░░█░░░░░██░░
      █░░█░█░░░░█░░░░█░░░░█░░░░█░░█░░░█░░█░░░░█░░█░░░░█░
      ░██░░█░░░░████░████░████░░██░░░░█░░█░░░░░██░░███░░
      "
    `)
  })
})
