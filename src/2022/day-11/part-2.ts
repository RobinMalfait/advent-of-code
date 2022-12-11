import part1 from './part-1'

export default function (blob: string) {
  let common = blob
    .split('\n')
    .filter((x) => x.includes('Test: divisible by'))
    .map((line) => line.trim().replace('Test: divisible by ', ''))
    .map(Number)
    .reduce((total, current) => total * current, 1)

  return part1(blob, 10000, (value) => value % common)
}
