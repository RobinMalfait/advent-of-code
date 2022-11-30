const { createIntcodeComputer, PROGRAM_MODES } = require('./computer')

it('should be possible to create a computer', () => {
  const computer = createIntcodeComputer('')

  expect(computer).toMatchSnapshot()
})

describe('ADDITION', () => {
  it('should be possible to add 2 values together', async () => {
    const program = [
      1, // The ADDITION OP
      0, // Position of param 1 (Which is the value 1)
      2, // Position of param 2 (Which is the value 3)
      0, // Position of target (Which will be in the beginning of the array)
    ].join(',')

    const computer = createIntcodeComputer(program, {
      mode: PROGRAM_MODES.ALL,
    })

    expect(await computer.run()).toEqual({
      output: [],
      input: [],
      memory: [3, 0, 2, 0],
    })
  })
})

describe('MULTIPLICATION', () => {
  it('should be possible to add 2 values together', async () => {
    const program = [
      2, // The MULTIPLICATION OP
      0, // Position of param 1 (Which is the value 1)
      2, // Position of param 2 (Which is the value 3)
      0, // Position of target (Which will be in the beginning of the array)
    ].join(',')

    const computer = createIntcodeComputer(program, {
      mode: PROGRAM_MODES.ALL,
    })

    expect(await computer.run()).toEqual({
      output: [],
      input: [],
      memory: [4, 0, 2, 0],
    })
  })
})

describe('I/O', () => {
  it('should be possible to do some IO related tasks', async () => {
    const program = [
      3, // The READ OP
      0, // Position of target
      4, // The OUTPUT OP
      0, // Position of param 1 (Which should be the input at position 0),
      3, // The READ OP
      1, // Position of param 1
      1, // The ADDITION OP
      0, // Position of param 1
      1, // Position of param 2
      0, // Position of target param
      4, // The OUTPUT OP
      0, // Position of param 1
    ].join(',')

    const computer = createIntcodeComputer(program, {
      mode: PROGRAM_MODES.ALL,
    })

    // Couple output to input again
    computer.output((value) => computer.input(value))

    // Start by giving it the initial input
    computer.input(123)

    expect(await computer.run()).toEqual({
      output: [123, 246 /* Doubled */],
      input: [246],
      memory: [246, 123, 4, 0, 3, 1, 1, 0, 1, 0, 4, 0],
    })
  })
})

describe('HALT', () => {
  it('should be possible to halt the program after a read', async () => {
    const program = [
      3, // The READ OP
      0, // Position of target
      99, // The HALT OP

      // Some other memory things that won't be touched
      1,
      0,
      2,
      2,
      0,
      2,
    ].join(',')

    const computer = createIntcodeComputer(program, {
      mode: PROGRAM_MODES.ALL,
    })

    // Start by giving it the initial input
    computer.input(123)

    expect(await computer.run()).toEqual({
      output: [],
      input: [],
      memory: [123, 0, 99, 1, 0, 2, 2, 0, 2],
    })
  })
})
