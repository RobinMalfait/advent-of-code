import { sum } from 'aoc-utils'

export default function (blob: string) {
  return sum(parse(blob.trim()).map(hash))
}

function hash(input: string) {
  let value = 0
  for (let char of input) {
    value += char.charCodeAt(0)
    value *= 17
    value %= 256
  }
  return value
}

function parse(input: string) {
  return input.split(',')
}
