enum Op {
  adv = 0,
  bxl = 1,
  bst = 2,
  jnz = 3,
  bxc = 4,
  out = 5,
  bdv = 6,
  cdv = 7,
}

export default function (blob: string) {
  let { registers, program } = parse(blob)
  let out = []

  let ip = 0
  while (ip < program.length) {
    let instruction = program[ip++]
    let operand = program[ip++]

    if (instruction === Op.bxl) {
      registers.B ^= operand
    } else if (instruction === Op.bst) {
      if (operand === 4) operand = registers.A
      else if (operand === 5) operand = registers.B
      else if (operand === 6) operand = registers.C
      else if (operand === 7) throw new Error('Invalid operand')
      registers.B = operand % 8
    } else if (instruction === Op.jnz) {
      if (registers.A === 0) continue
      ip = operand
    } else if (instruction === Op.bxc) {
      registers.B ^= registers.C
    } else if (instruction === Op.out) {
      if (operand === 4) operand = registers.A
      else if (operand === 5) operand = registers.B
      else if (operand === 6) operand = registers.C
      else if (operand === 7) throw new Error('Invalid operand')
      out.push(operand % 8)
    } else if (instruction === Op.adv) {
      if (operand === 4) operand = registers.A
      else if (operand === 5) operand = registers.B
      else if (operand === 6) operand = registers.C
      else if (operand === 7) throw new Error('Invalid operand')
      registers.A = registers.A >> operand
    } else if (instruction === Op.bdv) {
      if (operand === 4) operand = registers.A
      else if (operand === 5) operand = registers.B
      else if (operand === 6) operand = registers.C
      else if (operand === 7) throw new Error('Invalid operand')
      registers.B = registers.A >> operand
    } else if (instruction === Op.cdv) {
      if (operand === 4) operand = registers.A
      else if (operand === 5) operand = registers.B
      else if (operand === 6) operand = registers.C
      else if (operand === 7) throw new Error('Invalid operand')
      registers.C = registers.A >> operand
    }
  }

  return out.join(',')
}

function parse(input: string) {
  let program = input.match(/(\d+)/g).map(Number)
  return {
    registers: {
      A: program.shift(),
      B: program.shift(),
      C: program.shift(),
    },
    program,
  }
}
