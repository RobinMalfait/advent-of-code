export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => line.split(' '))

  let start = 92793999999999
  let x = 0
  while (true) {
    if (x % 10_000 === 0) {
      console.log('Trying', start, '(attempt:', x, ')')
    }
    x++
    let str = start.toString()
    start--
    if (str.includes('0')) continue

    if (compute(instructions, str.split('').map(Number))) {
      return start
    }
  }
}

function compute(instructions, input) {
  let registers = new Map()

  function resolve(value) {
    if (Number.parseInt(value) === value) {
      return Number.parseInt(value)
    }
    return registers.get(value)
  }

  for (let [instruction, ...values] of instructions) {
    switch (instruction) {
      case 'inp': {
        let [value] = values
        registers.set(value, input.shift())
        break
      }

      case 'add': {
        let [a, b] = values
        registers.set(a, registers.get(a) + resolve(b))
      }

      case 'mul': {
        let [a, b] = values
        registers.set(a, registers.get(a) * resolve(b))
      }

      case 'div': {
        let [a, b] = values
        let resolvedB = resolve(b)
        if (resolvedB === 0) return false
        registers.set(a, (registers.get(a) / resolve(b)) | 0)
      }

      case 'mod': {
        let [a, b] = values
        if (a < 0) return false
        let resolvedB = resolve(b)
        if (resolvedB <= 0) return false

        registers.set(a, registers.get(a) % resolvedB)
      }

      case 'eql': {
        let [a, b] = values
        registers.set(a, registers.get(a) === resolve(b) ? 1 : 0)
      }
    }
  }

  if (registers.get('z') !== 0) {
    console.log('Hmm', registers)
  }

  return registers.get('z') === 0
}
