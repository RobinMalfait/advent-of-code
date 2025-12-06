import { transpose } from 'aoc-utils'

export default function (blob: string) {
  let lines = blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(/\s+/))
  let operators = lines.pop()
  let blocks = transpose(lines.map((line) => line.map(Number)))

  let sum = 0
  for (let [idx, numbers] of blocks.entries()) {
    switch (operators[idx]) {
      case '+':
        sum += numbers.reduce((a, b) => a + b, 0)
        break
      case '*':
        sum += numbers.reduce((a, b) => a * b, 1)
        break
    }
  }

  return sum
}
