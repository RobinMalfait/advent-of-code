export default function (blob: string) {
  let crt = []
  let sprite = 1

  let cycle = 1
  let register_x = 1

  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(' '))
    .flatMap(([command, arg]) => {
      if (command === 'noop') return { type: 'noop' } as const
      else if (command === 'addx') return [{ type: 'noop' }, { type: 'addx', value: Number(arg) }] as const
    })

  for (let instruction of instructions) {
    crt[cycle - 1] = Math.abs(sprite - ((cycle - 1) % 40)) <= 1 ? '█' : ' '

    if (instruction.type === 'addx') {
      register_x += instruction.value
      sprite = register_x
    }

    cycle++
  }

  return crt
    .map((pixel, idx) => pixel + ((idx + 1) % 40 === 0 ? '\n' : ''))
    .join('')
    .trim()
}
