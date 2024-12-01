import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2015-08.txt'), 'utf8')
let sample = promises.readFile(resolve(__dirname, '../../../data/2015-08.sample.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[sample, 12]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part1(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('1342')
  })
})

describe('Part 2', () => {
  it.each([[sample, 19]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part2(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('2074')
  })
})
