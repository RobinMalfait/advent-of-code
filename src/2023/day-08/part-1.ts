export default function (blob: string) {
  let { instructions, map } = parse(blob.trim())

  let start = 'AAA'
  let end = 'ZZZ'

  let steps = 0
  let current = start

  while (current !== end) {
    let dir = instructions[steps % instructions.length]
    current = map[current][dir]
    steps++
  }

  return steps
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
