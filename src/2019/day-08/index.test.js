import { promises } from 'node:fs'
import { resolve } from 'node:path'

import part1 from './part-1.js'
import { border, flatten, process, raw, render, scale } from './part-2.js'

let data = promises.readFile(resolve(globalThis.process.cwd(), 'data', '2019-08.txt'), 'utf8')

describe('Part 1', () => {
  it.each([['123456789012', 3, 2, 1]])(
    'An input of %s with width=%s and height=%s results in a value of "%s"',
    (image, width, height, output) => {
      expect(part1(image, width, height)).toEqual(output)
    }
  )

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    expect(part1(await data, 25, 6)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  it.each([['0222112222120000', 2, 2, '0110']])(
    'An input of %s with width=%s and height=%s results in a value of "%s"',
    async (image, width, height, output) => {
      expect(await process(image, width, height).then(flatten()).then(raw())).toEqual(output)
    }
  )

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(
      await process(await data, 25, 6)
        .then(flatten())
        .then(border(2))
        .then(scale(2, 1))
        .then(render())
    ).toMatchSnapshot()
  })
})
