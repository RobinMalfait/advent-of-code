import { transpose } from 'aoc-utils'

export default function (blob: string) {
  let lines = blob.trim().split('\n')
  let operators = lines.pop().split(/\s+/g)
  let blocks = transpose(lines.map((line) => line.split('')))
    .map((line) => line.join('').trim())
    .join('\n')
    .split('\n\n')
    .map((line) => line.split('\n').map(Number).reverse())

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
