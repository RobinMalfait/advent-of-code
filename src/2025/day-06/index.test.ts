import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2025-06.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      [
        //
        '123 328  51 64 ',
        ' 45 64  387 23 ',
        '  6 98  215 314',
        '*   +   *   +  ',
      ].join('\n'),
      4277556,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"5335495999141"`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        //
        '123 328  51 64 ',
        ' 45 64  387 23 ',
        '  6 98  215 314',
        '*   +   *   +  ',
      ].join('\n'),
      3263827,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"10142723156431"`)
  })
})
