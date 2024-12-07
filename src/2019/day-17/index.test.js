import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2019-17.txt'), 'utf8')

describe('Part 1', () => {
  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(await part1(await data)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  // Actual test, Part 1
  it.skip('should produce the correct value for the input data', async () => {
    let program = (await data).split('')
    program[0] = 2

    expect(await part2(program.join(''))).toMatchSnapshot()
  })
})
