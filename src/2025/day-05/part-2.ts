import { Range } from 'aoc-utils'

export default function (blob: string) {
  let ranges = parse(blob)

  let fresh = 0
  for (let range of Range.mergeOverlapping(ranges)) {
    fresh += range.end - range.start + 1
  }
  return fresh
}

function parse(input: string) {
  return input.trim().split('\n\n')[0].split('\n').map(Range.fromString)
}
