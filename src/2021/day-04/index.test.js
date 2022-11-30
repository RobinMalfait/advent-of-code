import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2021-04.txt'), 'utf8')
let test = promises.readFile(resolve(process.cwd(), 'data', '2021-04.test.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[test, 4512]])('should produce the correct value for example %#', async (input, expected) => {
    expect(part1(await input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`27027`)
  })
})

describe('Part 2', () => {
  it.each([[test, 1924]])('should produce the correct value for example %#', async (input, expected) => {
    expect(part2(await input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`36975`)
  })
})
