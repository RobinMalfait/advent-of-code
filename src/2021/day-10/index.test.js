import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2021-10.txt'), 'utf8')
let test = `[({(<(())[]>[[{[]{<()<>>
[(()[<>])]({[<{<<[]>>(
{([(<{}[<>[]}>{[]{[(<()>
(((({<>}<{<{<>}{[]{[]{}
[[<[([]))<([[{}[[()]]]
[{[{({}]{}}([{[{{{}}([]
{<[[]]>}<{[{[{[]{()[[[]
[<(<(<(<{}))><([]([]()
<{([([[(<>()){}]>(<<{{
<{([{{}}[<[[[<>{}]]]>[]]`

describe('Part 1', () => {
  it.each([[test, 26397]])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot('339537')
  })
})

describe('Part 2', () => {
  it.each([[test, 288957]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part2(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot('2412013412')
  })
})
