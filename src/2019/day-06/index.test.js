import { promises } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '../../../data/2019-06.txt'), 'utf8')

describe('Part 1', () => {
  it('should calculate the direct and indirect orbits', () => {
    expect(
      part1(
        ['COM)B', 'B)C', 'C)D', 'D)E', 'E)F', 'B)G', 'G)H', 'D)I', 'E)J', 'J)K', 'K)L'].join('\n'),
      ),
    ).toEqual(42)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  it('should calculate amount of orbital transfers', () => {
    expect(
      part2(
        [
          'COM)B',
          'B)C',
          'C)D',
          'D)E',
          'E)F',
          'B)G',
          'G)H',
          'D)I',
          'E)J',
          'J)K',
          'K)L',
          'K)YOU',
          'I)SAN',
        ].join('\n'),
        'YOU',
        'SAN',
      ),
    ).toEqual(4)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data, 'YOU', 'SAN')).toMatchSnapshot()
  })
})
