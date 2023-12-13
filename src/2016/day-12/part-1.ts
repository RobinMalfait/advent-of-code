export default function (
  blob: string,
  registers = new Map([
    ['a', 0],
    ['b', 0],
    ['c', 0],
    ['d', 0],
  ])
) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  function resolve(input: ReturnType<typeof parseValue>) {
    if (input.type === 'literal') {
      return input.value
    } else if (input.type === 'variable') {
      return registers.get(input.name)
    } else {
      console.log('TODO', input)
      throw new Error('Not yet implemented.')
    }
  }

  for (let i = 0; i < instructions.length; i++) {
    let instruction = instructions[i]
    if (instruction.type === 'cpy') {
      registers.set(instruction.dst, resolve(instruction.src))
    } else if (instruction.type === 'inc') {
      registers.set(instruction.name, registers.get(instruction.name) + 1)
    } else if (instruction.type === 'dec') {
      registers.set(instruction.name, registers.get(instruction.name) - 1)
    } else if (instruction.type === 'jnz') {
      if (resolve(instruction.src) !== 0) {
        i -= 1
        i += resolve(instruction.amount)
      }
    } else {
      console.log('TODO', instruction)
      throw new Error('Not yet implemented.')
    }
  }

  return registers.get('a')
}

function parse(
  input: string
):
  | { type: 'cpy'; src: ReturnType<typeof parseValue>; dst: string }
  | { type: 'inc'; name: string }
  | { type: 'dec'; name: string }
  | { type: 'jnz'; src: ReturnType<typeof parseValue>; amount: ReturnType<typeof parseValue> } {
  let tokens = input.split(' ')
  if (tokens[0] === 'cpy') {
    return { type: 'cpy', src: parseValue(tokens[1]), dst: tokens[2] }
  } else if (tokens[0] === 'inc') {
    return { type: 'inc', name: tokens[1] }
  } else if (tokens[0] === 'dec') {
    return { type: 'dec', name: tokens[1] }
  } else if (tokens[0] === 'jnz') {
    return { type: 'jnz', src: parseValue(tokens[1]), amount: parseValue(tokens[2]) }
  } else {
    console.log('TODO', input)
    throw new Error('Not yet implemented.')
  }
}

function parseValue(
  input: string
): { type: 'variable'; name: string } | { type: 'literal'; value: number } {
  if (/^[a-z]+$/.test(input)) {
    return { type: 'variable', name: input }
  } else {
    return { type: 'literal', value: Number(input) }
  }
}
