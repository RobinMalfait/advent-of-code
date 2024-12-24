import { queue } from 'aoc-utils'

export default function (blob: string) {
  let { wires, gates } = parse(blob)
  let registers = new Map<string, number>()
  for (let [name, value] of wires) {
    registers.set(name, value)
  }

  let q = queue(gates)
  for (let gate of q) {
    if (registers.has(gate.lhs) && registers.has(gate.rhs)) {
      let lhs = registers.get(gate.lhs)
      let rhs = registers.get(gate.rhs)
      if (gate.op === 'AND') {
        registers.set(gate.target, lhs & rhs)
      } else if (gate.op === 'OR') {
        registers.set(gate.target, lhs | rhs)
      } else if (gate.op === 'XOR') {
        registers.set(gate.target, lhs ^ rhs)
      }
    } else {
      q.push(gate)
    }
  }

  let result = 0n
  for (let [name, value] of registers) {
    if (name[0] === 'z') {
      let idx = Number(name.slice(1))
      result |= BigInt(value) << BigInt(idx)
    }
  }
  return Number(result)
}

function parse(input: string) {
  let [wires, gates] = input.trim().split('\n\n')
  return {
    wires: wires
      .trim()
      .split('\n')
      .map((line) => {
        let [name, value] = line.trim().split(': ')
        return [name, Number(value)] as const
      }),

    gates: gates
      .trim()
      .split('\n')
      .map((line) => {
        let [lhs, op, rhs, _, target] = line.trim().split(' ')
        return { lhs, op, rhs, target }
      }),
  }
}
