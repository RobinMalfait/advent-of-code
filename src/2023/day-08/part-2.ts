import { lcm } from 'aoc-utils'

export default function (blob: string) {
  let { instructions, map } = parse(blob.trim())

  let steps = 0
  let total = 1
  let todo = Object.keys(map).filter((x) => x[x.length - 1] === 'A')

  while (todo.length > 0) {
    let dir = instructions[steps % instructions.length]

    for (let i = todo.length - 1; i >= 0; --i) {
      let current = todo[i]
      if (current[current.length - 1] === 'Z') {
        total = lcm(total, steps)
        todo.splice(i, 1)
      } else {
        todo[i] = map[current][dir]
      }
    }

    steps++
  }

  return total
}

function parse(input: string) {
  let [instructions, map] = input.split('\n\n')
  return {
    instructions: instructions.trim(),
    map: Object.fromEntries(
      map
        .trim()
        .split('\n')
        .map((line) => /(?<label>\w+) = \((?<L>\w+), (?<R>\w*)\)/g.exec(line.trim()).groups)
        .map(({ label, L, R }) => [label, { L, R }]),
    ),
  }
}
