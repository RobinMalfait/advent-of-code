import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2015-09.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`,
      605,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`207`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`,
      982,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`804`)
  })
})
