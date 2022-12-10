export default function (blob: string) {
  let cycle = 1
  let register_x = 1
  let total = 0

  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(' '))
    .flatMap(([command, arg]) => {
      if (command === 'noop') return { type: 'noop' } as const
      else if (command === 'addx') return [{ type: 'noop' }, { type: 'addx', value: Number(arg) }] as const
    })

  for (let instruction of instructions) {
    if (instruction.type === 'addx') {
      register_x += instruction.value
    }

    if ([20, 60, 100, 140, 180, 220].includes(++cycle)) {
      total += cycle * register_x
    }
  }

  return total
}
