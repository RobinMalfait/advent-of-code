import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2021-04.txt'), 'utf8')
let test = promises.readFile(resolve(__dirname, '../../../data/2021-04.test.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[test, 4512]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part1(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('27027')
  })
})

describe('Part 2', () => {
  it.each([[test, 1924]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part2(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('36975')
  })
})
