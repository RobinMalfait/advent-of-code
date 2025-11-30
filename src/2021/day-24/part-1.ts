export default function (blob: string, digits = 14) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  function* createInput(input: string) {
    for (let i = 0; i < input.length; i++) {
      yield Number(input[i])
    }
  }

  // let model = '13579246774235'
  let model = '9'.repeat(digits)
  let count = 0
  while (true) {
    count++
    if (model.length < digits) {
      return 0
    }

    // The moment we hit a 0, everything after it becomes 0, then we subtract 1.
    // E.g.: 1230456 -> 1230000 -> 1229999
    if (model.includes('0')) {
      // let index = model.indexOf('0')
      // model = model.slice(0, index + 1)
      // model = model.padEnd(digits, '0')
      model = `${Number(model) - 1}`
      continue
    }

    let input = createInput(model)

    let registers = new Map([
      ['w', 0],
      ['x', 0],
      ['y', 0],
      ['z', 0],
    ])

    function resolve(arg: number | 'w' | 'x' | 'y' | 'z') {
      if (typeof arg === 'number') return arg
      return registers.get(arg)
    }

    for (let [instruction, reg, arg] of instructions) {
      if (instruction === 'inp') registers.set(reg, input.next().value as number)
      if (instruction === 'add') registers.set(reg, registers.get(reg) + resolve(arg))
      if (instruction === 'mul') registers.set(reg, registers.get(reg) * resolve(arg))
      if (instruction === 'div') registers.set(reg, (registers.get(reg) / resolve(arg)) | 0)
      if (instruction === 'mod') registers.set(reg, registers.get(reg) % resolve(arg))
      if (instruction === 'eql') registers.set(reg, registers.get(reg) === resolve(arg) ? 1 : 0)
    }

    if (!model.includes('0') && registers.get('z') === 0) {
      return Number(model)
    }

    model = `${Number(model) - 1}`
  }
}

function parse(input: string) {
  let [instruction, reg, ...args] = input.split(/\s+/)
  return [
    instruction,
    reg as 'w' | 'x' | 'y' | 'z',
    ...args.map((arg) =>
      arg === 'w' || arg === 'x' || arg === 'y' || arg === 'z' ? arg : Number(arg),
    ),
  ] as const
}
