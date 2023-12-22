import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2023-20.txt'), 'utf8')

describe('Part 1', () => {
  it.each([
    [
      `
        broadcaster -> a, b, c
        %a -> b
        %b -> c
        %c -> inv
        &inv -> a
      `,
      32_000_000,
    ],

    [
      `
        broadcaster -> a
        %a -> inv, con
        &inv -> b
        %b -> con
        &con -> output
      `,
      11_687_500,
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part1(input)).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`834323022`)
  })
})

describe.skip('Part 2', () => {
  it.each([
    [
      `

      `,
      'TODO',
    ],
  ])('should produce the correct value for example %#', (input, expected) => {
    expect(part2(input)).toBe(expected)
  })

  it.skip('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchInlineSnapshot()
  })
})
