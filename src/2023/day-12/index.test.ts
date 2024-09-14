import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2023-12.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    ['???.### 1,1,3', 1],
    ['.??..??...?##. 1,1,3', 4],
    ['?#?#?#?#?#?#?#? 1,3,1,6', 1],
    ['????.#...#... 4,1,1', 1],
    ['????.######..#####. 1,6,5', 4],
    ['?###???????? 3,2,1', 10],
    [
      `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1
      `,
      21,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('7407')
  })
})

describe('Part 2', () => {
  it.each([
    ['???.### 1,1,3', 1],
    ['.??..??...?##. 1,1,3', 16384],
    ['?#?#?#?#?#?#?#? 1,3,1,6', 1],
    ['????.#...#... 4,1,1', 16],
    ['????.######..#####. 1,6,5', 2500],
    ['?###???????? 3,2,1', 506_250],
    [
      `
        ???.### 1,1,3
        .??..??...?##. 1,1,3
        ?#?#?#?#?#?#?#? 1,3,1,6
        ????.#...#... 4,1,1
        ????.######..#####. 1,6,5
        ?###???????? 3,2,1
      `,
      525_152,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('30568243604962')
  })
})
