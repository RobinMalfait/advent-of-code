import { promises } from 'fs'
import { resolve } from 'path'

import part1 from './part-1.js'
import part2 from './part-2.js'

let data = promises.readFile(resolve(process.cwd(), 'data', '2019-12.txt'), 'utf8')

describe('Part 1', () => {
  it('should produce the correct output for the test input', () => {
    const input = ['<x=-1, y=0, z=2>', '<x=2, y=-10, z=-7>', '<x=4, y=-8, z=8>', '<x=3, y=5, z=-1>'].join('\n')

    expect(part1.render(input, 0)).toEqual(
      [
        'pos=<x=-1, y=  0, z= 2>, vel=<x= 0, y= 0, z= 0>',
        'pos=<x= 2, y=-10, z=-7>, vel=<x= 0, y= 0, z= 0>',
        'pos=<x= 4, y= -8, z= 8>, vel=<x= 0, y= 0, z= 0>',
        'pos=<x= 3, y=  5, z=-1>, vel=<x= 0, y= 0, z= 0>',
      ].join('\n')
    )
    expect(part1.render(input, 1)).toEqual(
      [
        'pos=<x= 2, y=-1, z= 1>, vel=<x= 3, y=-1, z=-1>',
        'pos=<x= 3, y=-7, z=-4>, vel=<x= 1, y= 3, z= 3>',
        'pos=<x= 1, y=-7, z= 5>, vel=<x=-3, y= 1, z=-3>',
        'pos=<x= 2, y= 2, z= 0>, vel=<x=-1, y=-3, z= 1>',
      ].join('\n')
    )
    expect(part1.render(input, 10)).toEqual(
      [
        'pos=<x= 2, y= 1, z=-3>, vel=<x=-3, y=-2, z= 1>',
        'pos=<x= 1, y=-8, z= 0>, vel=<x=-1, y= 1, z= 3>',
        'pos=<x= 3, y=-6, z= 1>, vel=<x= 3, y= 2, z=-3>',
        'pos=<x= 2, y= 0, z= 4>, vel=<x= 1, y=-1, z=-1>',
      ].join('\n')
    )
    expect(part1.totalEnergy(input, 100))
  })

  it('should produce the correct total energy for the moons', () => {
    const input = ['<x=-1, y=0, z=2>', '<x=2, y=-10, z=-7>', '<x=4, y=-8, z=8>', '<x=3, y=5, z=-1>'].join('\n')

    expect(part1.totalEnergy(input, 10)).toEqual(179)
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    const steps = 1000

    expect(part1.totalEnergy(await data, steps)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  it.each([
    [2772, ['<x=-1, y=0, z=2>', '<x=2, y=-10, z=-7>', '<x=4, y=-8, z=8>', '<x=3, y=5, z=-1>'].join('\n')],
    [4686774924, ['<x=-8, y=-10, z=0>', '<x=5, y=5, z=10>', '<x=2, y=-7, z=3>', '<x=9, y=-8, z=-3>'].join('\n')],
  ])('should produce the total amount of steps (%s) to go back to the initial state', (output, input) => {
    expect(part2(input)).toEqual(output)
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    expect(part2(await data)).toMatchSnapshot()
  })
})
