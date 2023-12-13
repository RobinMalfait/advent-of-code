import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2020-13.txt'), 'utf8')

describe('Part 1', () => {
  it.each([[['939', '7,13,x,x,59,x,31,19'].join('\n'), (944 - 939) * 59]])(
    'should produce the correct value for example %#',
    (input, expected) => {
      expect(part1(input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`4808`)
  })
})

describe('Part 2', () => {
  it.each([
    [['...', '7,13,x,x,59,x,31,19'].join('\n'), 1068781],
    [['...', '17,x,13,19'].join('\n'), 3417],
    [['...', '67,7,59,61'].join('\n'), 754018],
    [['...', '67,x,7,59,61'].join('\n'), 779210],
    [['...', '67,7,x,59,61'].join('\n'), 1261476],
    [['...', '1789,37,47,1889'].join('\n'), 1202161486],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    let result = part2(await data)

    expect(result).toBeGreaterThan(100_000_000_000_000)
    expect(result).toMatchInlineSnapshot(`741745043105674`)
  })
})
