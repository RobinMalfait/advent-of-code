import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2024-20.txt'), 'utf8')

describe('Part 1', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data).toString()).toMatchInlineSnapshot(`"1404"`)
  })
})

describe('Part 2', () => {
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data).toString()).toMatchInlineSnapshot(`"1010981"`)
  })
})
