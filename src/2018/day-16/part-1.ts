import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  return blob
    .slice(0, blob.indexOf('\n\n\n\n'))
    .trim()
    .split('\n\n')
    .map((block) => {
      let [before, instructions, after] = block.split('\n').map((line) => parse(line.trim()))

      let correct = 0
      for (let opCode = 0; opCode <= 15; opCode++) {
        let run = program(before)
        let output = run(opCode, instructions[1], instructions[2], instructions[3])
        if (
          output.get(Register.A) === after[Register.A] &&
          output.get(Register.B) === after[Register.B] &&
          output.get(Register.C) === after[Register.C] &&
          output.get(Register.D) === after[Register.D]
        ) {
          correct += 1
        }
      }
      return correct
    })
    .filter((correct) => correct >= 3).length
}

enum Register {
  A = 0,
  B = 1,
  C = 2,
  D = 3,
}

function program(initial: number[]) {
  let registers = new DefaultMap<Register, number>(() => 0)

  // Seed the registers with the initial values
  for (let [idx, value] of initial.entries()) {
    registers.set(idx, value)
  }

  return (opcode: number, A: number, B: number, C: number) => {
    switch (opcode) {
      // Addition
      case 0: // addr
        registers.set(C, registers.get(A) + registers.get(B))
        break
      case 1: // addi
        registers.set(C, registers.get(A) + B)
        break

      // Multiplication
      case 2: // mulr
        registers.set(C, registers.get(A) * registers.get(B))
        break
      case 3: // muli
        registers.set(C, registers.get(A) * B)
        break

      // Bitwise AND
      case 4: // banr
        registers.set(C, registers.get(A) & registers.get(B))
        break
      case 5: // bani
        registers.set(C, registers.get(A) & B)
        break

      // Bitwise OR
      case 6: // borr
        registers.set(C, registers.get(A) | registers.get(B))
        break
      case 7: // bori
        registers.set(C, registers.get(A) | B)
        break

      // Assignment
      case 8: // setr
        registers.set(C, registers.get(A))
        break
      case 9: // seti
        registers.set(C, A)
        break

      // Greater-than testing
      case 10: // gtir
        registers.set(C, A > registers.get(B) ? 1 : 0)
        break
      case 11: // gtri
        registers.set(C, registers.get(A) > B ? 1 : 0)
        break
      case 12: // gtrr
        registers.set(C, registers.get(A) > registers.get(B) ? 1 : 0)
        break

      // Equality testing
      case 13: // eqir
        registers.set(C, A === registers.get(B) ? 1 : 0)
        break
      case 14: // eqri
        registers.set(C, registers.get(A) === B ? 1 : 0)
        break
      case 15: // eqrr
        registers.set(C, registers.get(A) === registers.get(B) ? 1 : 0)
        break
    }

    return registers
  }
}

function parse(input: string) {
  if (input.startsWith('Before:') || input.startsWith('After:')) {
    return input
      .slice(9, -1)
      .split(/\s*,\s*/g)
      .map(Number)
  }

  return input.split(/\s+/g).map(Number)
}
