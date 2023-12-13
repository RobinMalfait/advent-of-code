import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1'
import part2 from './part-2'

let sample = promises.readFile(
  resolve(__dirname, '..', '..', '..', 'data', '2022-10.sample.txt'),
  'utf8'
)
let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2022-10.txt'), 'utf8')

function dedent(input: string) {
  return input
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
}

describe('Part 1', () => {
  it.each([[sample, 13140]])(
    'should produce the correct value for example %#',
    async (input, expected) => {
      expect(part1(await input)).toBe(expected)
    }
  )

  it('should produce the correct value for the input data', async () => {
    expect(part1(await data)).toMatchInlineSnapshot(`15140`)
  })
})

describe('Part 2', () => {
  it.each([
    [
      sample,
      dedent(`
        ██  ██  ██  ██  ██  ██  ██  ██  ██  ██
        ███   ███   ███   ███   ███   ███   ███
        ████    ████    ████    ████    ████
        █████     █████     █████     █████
        ██████      ██████      ██████      ████
        ███████       ███████       ███████
      `),
    ],
  ])('should produce the correct value for example %#', async (input, expected) => {
    expect(dedent(part2(await input))).toBe(expected)
  })

  it('should produce the correct value for the input data', async () => {
    expect(dedent(part2(await data))).toEqual(
      dedent(`
        ███  ███    ██  ██  ████  ██   ██  ███
        █  █ █  █    █ █  █    █ █  █ █  █ █  █
        ███  █  █    █ █  █   █  █    █  █ █  █
        █  █ ███     █ ████  █   █ ██ ████ ███
        █  █ █    █  █ █  █ █    █  █ █  █ █
        ███  █     ██  █  █ ████  ███ █  █ █
      `)
    )
  })
})
