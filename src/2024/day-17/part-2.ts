import { queue } from 'aoc-utils'

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
  let originalB = registers.B
  let originalC = registers.C

  let q = queue<[bigint, number]>([[0n, 0]])
  let min: bigint | null = null

  for (let [a, i] of q) {
    if (i === program.length) {
      if (min === null || a < min) min = a
      continue
    }

    for (let bit = 0n; bit < 8n; bit++) {
      let tryA = (a << 3n) | bit

      if (run(tryA, originalB, originalC) === program.at(-i - 1)) {
        q.push([tryA, i + 1])
      }
    }
  }

  return Number(min)

  function run(a: bigint, b: bigint, c: bigint) {
    registers.A = a
    registers.B = b
    registers.C = c

    let ip = 0
    while (ip < program.length) {
      let instruction = program[ip++]
      let operand = BigInt(program[ip++])

      if (instruction === Op.bxl) {
        registers.B ^= operand
      } else if (instruction === Op.bst) {
        if (operand === 4n) operand = registers.A
        else if (operand === 5n) operand = registers.B
        else if (operand === 6n) operand = registers.C
        else if (operand === 7n) throw new Error('Invalid operand')
        registers.B = operand % 8n
      } else if (instruction === Op.jnz) {
        if (registers.A === 0n) continue
        ip = Number(operand)
      } else if (instruction === Op.bxc) {
        registers.B ^= registers.C
      } else if (instruction === Op.out) {
        if (operand === 4n) operand = registers.A
        else if (operand === 5n) operand = registers.B
        else if (operand === 6n) operand = registers.C
        else if (operand === 7n) throw new Error('Invalid operand')
        return Number(operand % 8n)
      } else if (instruction === Op.adv) {
        if (operand === 4n) operand = registers.A
        else if (operand === 5n) operand = registers.B
        else if (operand === 6n) operand = registers.C
        else if (operand === 7n) throw new Error('Invalid operand')
        registers.A = registers.A >> operand
      } else if (instruction === Op.bdv) {
        if (operand === 4n) operand = registers.A
        else if (operand === 5n) operand = registers.B
        else if (operand === 6n) operand = registers.C
        else if (operand === 7n) throw new Error('Invalid operand')
        registers.B = registers.A >> operand
      } else if (instruction === Op.cdv) {
        if (operand === 4n) operand = registers.A
        else if (operand === 5n) operand = registers.B
        else if (operand === 6n) operand = registers.C
        else if (operand === 7n) throw new Error('Invalid operand')
        registers.C = registers.A >> operand
      }
    }
  }
}

function parse(input: string) {
  let program = input.match(/(\d+)/g).map(Number)
  return {
    registers: {
      A: BigInt(program.shift()),
      B: BigInt(program.shift()),
      C: BigInt(program.shift()),
    },
    program,
  }
}

// Program:
//
// B = A % 8
// B = B ^ 5
// C = A >> 5
// B = B ^ C
// B = B ^ 6
// A = A >> 3
// out B % 8
// if (A !== 0) goto 0
//
// Substituting some values:
//
// B = A % 8
// B = B ^ 5
// -> B = (A % 8) ^ 5
// C = A >> 5
// B = B ^ C
// -> B = ((A % 8) ^ 5) ^ (A >> 5)
// B = B ^ 6
// -> B = (((A % 8) ^ 5) ^ (A >> 5)) ^ 6
// A = A >> 3  # Remove 3 least significant bits
// out B % 8   # Value will be in range of 0…8
