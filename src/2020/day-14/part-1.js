export default function (blob) {
  let program = blob
    .trim()
    .split('\n')
    .map((line) => {
      if (line.startsWith('mask = ')) return line.replace('mask = ', '')
      let { address, value } = /mem\[(?<address>\d+)\] = (?<value>\d+)/g.exec(line).groups
      return { address, value: BigInt(value) }
    })

  function modify(mask, value) {
    let or = BigInt(Number.parseInt(mask.replace(/X/g, '0'), 2))
    let and = BigInt(Number.parseInt(mask.replace(/X/g, '1'), 2))
    return (value | or) & and
  }

  let memory = new Map()
  let mask = 0
  for (let instruction of program) {
    if (typeof instruction === 'string') {
      mask = instruction
    } else {
      memory.set(instruction.address, modify(mask, instruction.value))
    }
  }

  let sum = 0n
  for (let current of memory.values()) {
    sum += current
  }

  return Number(sum)
}
