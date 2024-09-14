import { promises } from 'node:fs'
import { resolve } from 'node:path'

let data = promises.readFile(resolve(__dirname, '..', '..', '..', 'data', '2019-05.txt'), 'utf8')

const { createIntcodeComputer, PROGRAM_MODES } = require('../intcode/computer')

function compute(program, input, options) {
  const computer = createIntcodeComputer(program, options)
  computer.input(input)
  return computer.run()
}

describe('Part 1', () => {
  it('should be a valid program', async () => {
    expect(await compute('1101,100,-1,4,0', [], { mode: PROGRAM_MODES.MEMORY })).toEqual([
      1101, 100, -1, 4, 99,
    ])
  })

  it('should do multiplication and store the result in the last value', async () => {
    // This instruction multiplies its first two parameters. The first
    // parameter, 4 in position mode, works like it did before - its value is
    // the value stored at address 4 (33). The second parameter, 3 in immediate
    // mode, simply has value 3. The result of this operation, 33 * 3 = 99, is
    // written according to the third parameter, 4 in position mode, which also
    // works like it did before - 99 is written to address 4.
    expect(await compute('1002,4,3,4,33', [], { mode: PROGRAM_MODES.MEMORY })).toEqual([
      1002, 4, 3, 4, 99,
    ])
  })

  it('should output the input', async () => {
    expect(await compute('3,0,4,0,99', [123])).toEqual([123])
  })

  // Actual test, Part 1
  it('should produce the correct value for the input data', async () => {
    const input = [1]

    expect(await compute(await data, input)).toMatchSnapshot()
  })
})

describe('Part 2', () => {
  it('should be a valid jump test (using position mode)', async () => {
    expect(await compute('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', [0])).toEqual([0])
    expect(await compute('3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9', [1])).toEqual([1])
  })

  it('should be a valid jump test (using immediate mode)', async () => {
    expect(await compute('3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [0])).toEqual([0])
    expect(await compute('3,3,1105,-1,9,1101,0,0,12,4,12,99,1', [1])).toEqual([1])
  })

  it('should be a valid jump & equals test', async () => {
    const program =
      '3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99'

    // Will output 999 if below 8
    expect(await compute(program, [6])).toEqual([999])

    // Will output 1000 if is equals to 8
    expect(await compute(program, [8])).toEqual([1000])

    // Will output 1001 if is greater than 8
    expect(await compute(program, [12])).toEqual([1001])
  })

  // Actual test, Part 2
  it('should produce the correct value for the input data', async () => {
    const input = [5]

    expect(await compute(await data, input)).toMatchSnapshot()
  })
})
