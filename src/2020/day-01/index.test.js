import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2020-01.txt'), 'utf8')

describe('Part 1', () => {
  it.each([['1721 979 366 299 675 1456'.split(' ').join('\n'), 1721 * 299]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part1(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('927684')
  })
})

describe('Part 2', () => {
  it.each([['1721 979 366 299 675 1456'.split(' ').join('\n'), 979 * 366 * 675]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part2(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('292093004')
  })
})
