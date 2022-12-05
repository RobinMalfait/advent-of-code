export default function (blob: string) {
  let [raw_stacks, raw_instructions] = blob.split('\n\n')

  let stacks = parseStacks(raw_stacks)
  let instructions = parseInstructions(raw_instructions)

  for (let { amount, from, to } of instructions) {
    stacks[to].push(...stacks[from].splice(stacks[from].length - amount))
  }

  return stacks.map((x) => x[x.length - 1]).join('')
}

function parseStacks(input: string): string[][] {
  return transpose(
    input
      .replaceAll('    ', '[_]') // Fill in the blanks
      .replaceAll('[', ' ') // Make it splitable #1
      .replaceAll(']', ' ') // Make it splitable #2
      .split('\n')
      .slice(0, -1) // Ignore the line with crate numbers
      .map((line: string) => line.split(' ').filter((x) => x.trim().length !== 0))
  ).map((stack) => stack.filter((x) => x !== '_').reverse())
}

function parseInstructions(input: string) {
  return input
    .trim()
    .split('\n')
    .map((x) => x.replace('move', '').replace('from', ',').replace('to', ',').split(',').map(Number))
    .map(([amount, from, to]) => ({ amount, from: from - 1, to: to - 1 }))
}

function transpose<T>(arr: T[][]): T[][] {
  return arr[0].map((_, idx) => arr.map((col) => col[idx]))
}
