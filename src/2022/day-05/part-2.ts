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
      .split('\n')
      .reverse()
      .slice(1)
      .map((line) => line.split('').filter((_, i) => (i - 1) % 4 === 0))
  ).map((row) => row.filter((x) => Boolean(x.trim())))
}

function parseInstructions(input: string) {
  return input
    .trim()
    .split('\n')
    .map((x) => x.split(' ').map(Number).filter(Boolean))
    .map(([amount, from, to]) => ({ amount, from: from - 1, to: to - 1 }))
}

function transpose<T>(arr: T[][]): T[][] {
  return arr[0].map((_, idx) => arr.map((col) => col[idx]))
}
