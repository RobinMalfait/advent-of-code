export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((instruction) => instruction.split(' '))
    .map(([operation, argument]) => [operation, Number(argument)])

  let acc = 0
  let pc = 0
  let history = new Set()

  while (pc <= instructions.length - 1) {
    if (history.has(pc)) return acc
    history.add(pc)

    let [operation, argument] = instructions[pc]
    pc += {
      nop: () => 1,
      acc: () => {
        acc += argument
        return 1
      },
      jmp: () => argument,
    }[operation]()
  }

  return acc
}
