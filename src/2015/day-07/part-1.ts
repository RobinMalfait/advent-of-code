export default function (blob: string) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .map(parse)

  let registers = new Map<string, number>()

  function lookup(
    input: { type: 'LITERAL'; value: number } | { type: 'VARIABLE'; name: string }
  ): number | null {
    if (input.type === 'LITERAL') {
      return input.value
    }
    if (registers.has(input.name)) {
      return registers.get(input.name)
    }
    return null
  }

  let todo = instructions.slice()
  while (todo.length > 0) {
    let instruction = todo.shift()

    if (instruction.type === 'VALUE') {
      let lhs = lookup(instruction.value)
      if (lhs === null) {
        todo.push(instruction)
        continue
      }

      registers.set(instruction.target, lhs)
    } else if (instruction.type === 'AND') {
      let [lhs, rhs] = [lookup(instruction.lhs), lookup(instruction.rhs)]
      if (lhs === null || rhs === null) {
        todo.push(instruction)
        continue
      }

      registers.set(instruction.target, lhs & rhs)
    } else if (instruction.type === 'OR') {
      let [lhs, rhs] = [lookup(instruction.lhs), lookup(instruction.rhs)]
      if (lhs === null || rhs === null) {
        todo.push(instruction)
        continue
      }

      registers.set(instruction.target, lhs | rhs)
    } else if (instruction.type === 'LSHIFT') {
      let [lhs, rhs] = [lookup(instruction.lhs), lookup(instruction.rhs)]
      if (lhs === null || rhs === null) {
        todo.push(instruction)
        continue
      }

      registers.set(instruction.target, lhs << rhs)
    } else if (instruction.type === 'RSHIFT') {
      let [lhs, rhs] = [lookup(instruction.lhs), lookup(instruction.rhs)]
      if (lhs === null || rhs === null) {
        todo.push(instruction)
        continue
      }

      registers.set(instruction.target, lhs >> rhs)
    } else if (instruction.type === 'NOT') {
      let rhs = lookup(instruction.rhs)
      if (rhs === null) {
        todo.push(instruction)
        continue
      }

      registers.set(instruction.target, 65535 - rhs)
    } else {
      console.log(instruction)
      throw new Error('Not implemented yet.')
    }
  }

  return registers.get('a') ?? null
}

function parse(input: string) {
  let [expression, target] = input.split(' -> ')
  if (expression.startsWith('NOT')) {
    let [_, rhs] = expression.split(' ').map(parseValue)
    return { type: 'NOT' as const, rhs, target }
  }
  if (expression.includes('OR')) {
    let [lhs, rhs] = expression.split(' OR ').map(parseValue)
    return { type: 'OR' as const, lhs, rhs, target }
  }
  if (expression.includes('AND')) {
    let [lhs, rhs] = expression.split(' AND ').map(parseValue)
    return { type: 'AND' as const, lhs, rhs, target }
  }
  if (expression.includes('LSHIFT')) {
    let [lhs, rhs] = expression.split(' LSHIFT ').map(parseValue)
    return { type: 'LSHIFT' as const, lhs, rhs, target }
  }
  if (expression.includes('RSHIFT')) {
    let [lhs, rhs] = expression.split(' RSHIFT ').map(parseValue)
    return { type: 'RSHIFT' as const, lhs, rhs, target }
  }
  return { type: 'VALUE' as const, value: parseValue(expression), target }
}

function parseValue(input: string) {
  if (input.match(/^\d+$/)) {
    return { type: 'LITERAL' as const, value: Number.parseInt(input, 10) }
  }
  return { type: 'VARIABLE' as const, name: input }
}
