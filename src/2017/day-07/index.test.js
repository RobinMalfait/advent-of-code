import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2017-07.txt'), 'utf8')

describe('Part 1', () => {
  // Part 1
  it.each([
    // Example one
    [
      [
        'pbga (66)',
        'xhth (57)',
        'ebii (61)',
        'havc (66)',
        'ktlj (57)',
        'fwft (72) -> ktlj, cntj, xhth',
        'qoyq (66)',
        'padx (45) -> pbga, havc, qoyq',
        'tknk (41) -> ugml, padx, fwft',
        'jptl (61)',
        'ugml (68) -> gyxo, ebii, jptl',
        'gyxo (61)',
        'cntj (57)',
      ].join('\n'),
      'tknk',
    ],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`"svugo"`)
  })
})

describe('Part 2', () => {
  // Part 2
  it.each([
    [
      [
        'pbga (66)',
        'xhth (57)',
        'ebii (61)',
        'havc (66)',
        'ktlj (57)',
        'fwft (72) -> ktlj, cntj, xhth',
        'qoyq (66)',
        'padx (45) -> pbga, havc, qoyq',
        'tknk (41) -> ugml, padx, fwft',
        'jptl (61)',
        'ugml (68) -> gyxo, ebii, jptl',
        'gyxo (61)',
        'cntj (57)',
      ].join('\n'),
      60,
    ],
  ])('%s should result in "%s"', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`5`)
  })
})
