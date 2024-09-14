import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-22.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      ['Player 1:', '9', '2', '6', '3', '1', '', 'Player 2:', '5', '8', '4', '7', '10'].join('\n'),
      306,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('33393')
  })
})

describe('Part 2', () => {
  it.each([
    [
      ['Player 1:', '9', '2', '6', '3', '1', '', 'Player 2:', '5', '8', '4', '7', '10'].join('\n'),
      291,
    ],
    [['Player 1:', '43', '19', '', 'Player 2:', '2', '29', '14'].join('\n'), 105],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('31963')
  })
})
