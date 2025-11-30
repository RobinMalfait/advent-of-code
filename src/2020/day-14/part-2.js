export default function (blob) {
  let program = blob
    .trim()
    .split('\n')
    .map((line) => {
      if (line.startsWith('mask = ')) return line.replace('mask = ', '')
      let { address, value } = /mem\[(?<address>\d+)\] = (?<value>\d+)/g.exec(line).groups
      return { address: BigInt(address), value: BigInt(value) }
    })

  let memory = new Map()

  let mask = 0
  for (let instruction of program) {
    if (typeof instruction === 'string') {
      mask = instruction
    } else {
      let bits = instruction.address.toString(2).padStart(36, '0').split('')

      for (let [idx, value] of mask.split('').entries()) {
        if (value === '0') continue
        bits[idx] = value
      }

      let xs = bits.join('').split('X').length - 1

      for (let i = 0; i < 2 ** xs; i++) {
        let floater = i.toString(2).padStart(xs, '0').split('').map(Number)
        memory.set(
          bits.map((bit) => (bit === 'X' ? floater.shift() : bit)).join(''),
          instruction.value,
        )
      }
    }
  }

  let sum = 0n
  for (let current of memory.values()) {
    sum += current
  }

  return Number(sum)
}
