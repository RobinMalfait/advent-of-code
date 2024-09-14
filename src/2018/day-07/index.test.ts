import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2018-07.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        Step C must be finished before step A can begin.
        Step C must be finished before step F can begin.
        Step A must be finished before step B can begin.
        Step A must be finished before step D can begin.
        Step B must be finished before step E can begin.
        Step D must be finished before step E can begin.
        Step F must be finished before step E can begin.
      `,
      'CABDFE',
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`"BETUFNVADWGPLRJOHMXKZQCISY"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `
        Step C must be finished before step A can begin.
        Step C must be finished before step F can begin.
        Step A must be finished before step B can begin.
        Step A must be finished before step D can begin.
        Step B must be finished before step E can begin.
        Step D must be finished before step E can begin.
        Step F must be finished before step E can begin.
      `,
      15,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input, 2, 0)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('848')
  })
})
