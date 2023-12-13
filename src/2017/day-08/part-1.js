export default function (blob) {
  let instructions = blob
    .trim()
    .split('\n')
    .map(
      (instruction) =>
        /(?<register>[^ ]+) (?<action>[^ ]+) (?<amount>[^ ]+) if (?<arg1>[^ ]+) (?<operator>[^ ]+) (?<arg2>[^ ]+)/g.exec(
          instruction
        ).groups
    )
    .map(({ arg2, amount, ...rest }) => ({ ...rest, arg2: Number(arg2), amount: Number(amount) }))

  let registers = {}
  let sign = { inc: +1, dec: -1 }

  for (let { register, action, amount, arg1, arg2, operator } of instructions) {
    registers[register] ??= 0
    registers[arg1] ??= 0

    if (
      (operator === '>' && registers[arg1] > arg2) ||
      (operator === '<' && registers[arg1] < arg2) ||
      (operator === '>=' && registers[arg1] >= arg2) ||
      (operator === '<=' && registers[arg1] <= arg2) ||
      (operator === '==' && registers[arg1] === arg2) ||
      (operator === '!=' && registers[arg1] !== arg2)
    ) {
      registers[register] += amount * sign[action]
    }
  }

  return Math.max(...Object.values(registers))
}
