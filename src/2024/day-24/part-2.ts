export default function (blob: string) {
  let gates = parse(blob)

  // Half adder:
  //
  // A XOR B = S        (sum)
  // A AND B = C        (carry)

  // Full adder:
  //
  // A XOR B = S1       (intermediate sum)
  // A AND B = C1       (intermediate carry)
  // Cin XOR S1 = S     (final sum)
  // Cin AND S1 = C2
  // C1 OR C2 = Cout    (final carry)
  //
  // Full adder shortened:
  //
  // Cin XOR (A XOR B)                = S    (sum)
  // (A AND B) OR (Cin AND (A XOR B)) = Cout (carry)
  //
  //
  let swaps = []
  for (let gate of gates) {
    // > Specifically, it is treating the bits on wires starting with x as one
    // > binary number, treating the bits on wires starting with y as a second
    // > binary number, and then attempting to add those two numbers together.
    //
    // If an XOR is involved, x…, y… and z… should also be involved, if not, we
    // need to swap.
    if (
      gate.op === 'XOR' &&
      gate.lhs[0] !== 'x' &&
      gate.lhs[0] !== 'y' &&
      gate.lhs[0] !== 'z' &&
      gate.rhs[0] !== 'x' &&
      gate.rhs[0] !== 'y' &&
      gate.rhs[0] !== 'z' &&
      gate.target[0] !== 'x' &&
      gate.target[0] !== 'y' &&
      gate.target[0] !== 'z'
    ) {
      swaps.push(gate.target)
    }

    //
    else if (gate.target[0] === 'z' && gate.op !== 'XOR' && gate.target !== 'z45') {
      swaps.push(gate.target)
    }

    // > In all three cases, wire `00` is the least significant bit.
    //
    // AND gates are for the carry
    else if (
      gate.op === 'AND' &&
      gate.lhs !== 'x00' &&
      gate.rhs !== 'x00' &&
      gate.lhs !== 'y00' &&
      gate.rhs !== 'y00' &&
      gate.lhs !== 'z00' &&
      gate.rhs !== 'z00'
    ) {
      for (let other of gates) {
        if ((other.lhs === gate.target || other.rhs === gate.target) && other.op !== 'OR') {
          swaps.push(gate.target)
          break
        }
      }
    }

    //
    else if (gate.op === 'XOR') {
      for (let other of gates) {
        if ((other.lhs === gate.target || other.rhs === gate.target) && other.op === 'OR') {
          swaps.push(gate.target)
          break
        }
      }
    }
  }

  return swaps.sort().join(',')
}

function parse(input: string) {
  let [_, gates] = input.trim().split('\n\n')
  return gates
    .trim()
    .split('\n')
    .map((line) => {
      let [lhs, op, rhs, _, target] = line.trim().split(' ')
      return { lhs, op, rhs, target }
    })
}
