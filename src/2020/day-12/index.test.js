import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2020-12.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [['F10', 'N3', 'F7', 'R90', 'F11'].join('\n'), 17 + 8],
    [['F29', 'E5', 'L90', 'W1', 'R90', 'E1', 'R90'].join('\n'), 34],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('759')
  })
})

describe('Part 2', () => {
  it.each([[['F10', 'N3', 'F7', 'R90', 'F11'].join('\n'), 214 + 72]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part2(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('45763')
  })
})
