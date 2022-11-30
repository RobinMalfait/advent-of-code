import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2020-19.txt'), 'utf8')

describe('Part 1', () => {
  it.each(
    [
      // Direct single value
      [['0: "a"', 'a'].join('\n\n'), 1],
      [['0: "a"', 'b'].join('\n\n'), 0],
      [['0: "a"', 'aa'].join('\n\n'), 0],
      [['0: "a"', '', 'a', 'b', 'a'].join('\n'), 2],

      // Direct multiple values (or)
      [['0: "a" | "b"', 'a'].join('\n\n'), 1],
      [['0: "a" | "b"', 'b'].join('\n\n'), 1],
      [['0: "a" | "b"', 'aa'].join('\n\n'), 0],
      [['0: "a" | "b"', 'bb'].join('\n\n'), 0],
      [['0: "a" | "b"', 'ab'].join('\n\n'), 0],
      [['0: "a" | "b"', 'ba'].join('\n\n'), 0],

      // Reference rule
      [['0: 1', '1: "a"', '', 'a'].join('\n'), 1],
      [['0: 1', '1: "a"', '', 'b'].join('\n'), 0],
      [['0: 1', '1: "a"', '', 'aa'].join('\n'), 0],

      // Single deeply nested reference lookup
      [['0: 1', '1: 2', '2: 3', '3: 4', '4: "a"', '', 'a'].join('\n'), 1],
      [['0: 1', '1: 2', '2: 3', '3: 4', '4: "a"', '', 'b'].join('\n'), 0],

      // Must match multiple rules
      [['0: 1 2', '1: "a"', '2: "b"', '', 'a'].join('\n'), 0],
      [['0: 1 2', '1: "a"', '2: "b"', '', 'b'].join('\n'), 0],
      [['0: 1 2', '1: "a"', '2: "b"', '', 'aa'].join('\n'), 0],
      [['0: 1 2', '1: "a"', '2: "b"', '', 'bb'].join('\n'), 0],
      [['0: 1 2', '1: "a"', '2: "b"', '', 'ab'].join('\n'), 1],
      [['0: 1 2', '1: "a"', '2: "b"', '', 'ba'].join('\n'), 0],

      // Must match nested, and positional rules
      [['0: 1 2', '1: "a" "b"', '2: "a" "b"', '', 'abab'].join('\n'), 1],
      [['0: 1 2', '1: "a" "b"', '2: "c" "d"', '', 'abcd'].join('\n'), 1],
      [['0: 1 2', '1: "a" "b" 3', '2: "c" "d"', '3: "e"', '', 'abecd'].join('\n'), 1],
      [['0: 1 2', '1: 2 3', '2: "a" "c"', '3: "d"', '', 'acdac'].join('\n'), 1],

      // Example input
      [['0: 4 1 5', '1: 2 3 | 3 2', '2: 4 4 | 5 5', '3: 4 5 | 5 4', '4: "a"', '5: "b"', '', 'ababbb', 'bababa', 'abbbab', 'aaabbb', 'aaaabbb'].join('\n'), 2],
    ].slice(21, 22)
  )('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`139`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      [
        '42: 9 14 | 10 1',
        '9: 14 27 | 1 26',
        '10: 23 14 | 28 1',
        '1: "a"',
        '11: 42 31',
        '5: 1 14 | 15 1',
        '19: 14 1 | 14 14',
        '12: 24 14 | 19 1',
        '16: 15 1 | 14 14',
        '31: 14 17 | 1 13',
        '6: 14 14 | 1 14',
        '2: 1 24 | 14 4',
        '0: 8 11',
        '13: 14 3 | 1 12',
        '15: 1 | 14',
        '17: 14 2 | 1 7',
        '23: 25 1 | 22 14',
        '28: 16 1',
        '4: 1 1',
        '20: 14 14 | 1 15',
        '3: 5 14 | 16 1',
        '27: 1 6 | 14 18',
        '14: "b"',
        '21: 14 1 | 1 14',
        '25: 1 1 | 1 14',
        '22: 14 14',
        '8: 42',
        '26: 14 22 | 1 20',
        '18: 15 15',
        '7: 14 5 | 1 21',
        '24: 14 1',
        '',
        'abbbbbabbbaaaababbaabbbbabababbbabbbbbbabaaaa',
        'bbabbbbaabaabba',
        'babbbbaabbbbbabbbbbbaabaaabaaa',
        'aaabbbbbbaaaabaababaabababbabaaabbababababaaa',
        'bbbbbbbaaaabbbbaaabbabaaa',
        'bbbababbbbaaaaaaaabbababaaababaabab',
        'ababaaaaaabaaab',
        'ababaaaaabbbaba',
        'baabbaaaabbaaaababbaababb',
        'abbbbabbbbaaaababbbbbbaaaababb',
        'aaaaabbaabaaaaababaa',
        'aaaabbaaaabbaaa',
        'aaaabbaabbaaaaaaabbbabbbaaabbaabaaa',
        'babaaabbbaaabaababbaabababaaab',
        'aabbbbbaabbbaaaaaabbbbbababaaaaabbaaabba',
      ].join('\n'),
      12,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot(`289`)
  })
})
