import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2019-22.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [['deal with increment 7', 'deal into new stack', 'deal into new stack'].join('\n'), [0, 3, 6, 9, 2, 5, 8, 1, 4, 7]],
    [['cut 6', 'deal with increment 7', 'deal into new stack'].join('\n'), [3, 0, 7, 4, 1, 8, 5, 2, 9, 6]],
    [['deal with increment 7', 'deal with increment 9', 'cut -2'].join('\n'), [6, 3, 0, 7, 4, 1, 8, 5, 2, 9]],
    [
      [
        'deal into new stack',
        'cut -2',
        'deal with increment 7',
        'cut 8',
        'cut -4',
        'deal with increment 7',
        'cut 3',
        'deal with increment 9',
        'deal with increment 3',
        'cut -1',
      ].join('\n'),
      [9, 2, 5, 8, 1, 4, 7, 0, 3, 6],
    ],
  ])('should produce the correct output for the given input', (input, output) => {
    expect(part1(input, 10)).toEqual(output)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    const shuffled_deck = part1(await data, 10007)

    expect(shuffled_deck.indexOf(2019)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  // Actual test, Part 2
  xit('should produce the correct value for the input data', async () => {
    const card = part2(
      await data,

      // Deck Size
      Number('119_315_717_514_047'.replace(/_/g, '')), // HACK TO HAVE SOME _'S

      // Repititions
      Number('101_741_582_076_661'.replace(/_/g, '')), // HACK TO HAVE SOME _'S

      // Position
      2020
    )

    expect(card).toMatchSnapshot()
  })
})
