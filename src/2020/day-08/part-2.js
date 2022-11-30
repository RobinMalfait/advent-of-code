let INFINITE_LOOP = Symbol()

export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((instruction) => instruction.split(' '))
    .map(([operation, argument]) => [operation, Number(argument)])

  let lastIdx = 0
  let acc = compute(instructions)
  while (acc === INFINITE_LOOP) {
    lastIdx++

    let copy = instructions.slice()
    let idx = copy.length - 1 - copy.findIndex(([name], idx) => (idx < lastIdx ? false : ['nop', 'jmp'].includes(name)))
    copy[lastIdx] = [copy[idx][0] === 'nop' ? 'jmp' : 'nop', copy[idx][1]]

    acc = compute(copy)
  }

  return acc
}

function compute(instructions) {
  let acc = 0
  let pc = 0
  let history = new Set()

  while (pc <= instructions.length - 1) {
    if (history.has(pc)) return INFINITE_LOOP
    history.add(pc)

    let [operation, argument] = instructions[pc]
    pc += {
      nop: () => 1,
      acc: () => ((acc += argument), 1),
      jmp: () => argument,
    }[operation]()
  }

  return acc
}
