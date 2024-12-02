import { isSafeLevel } from './part-1'

export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .filter((level) => {
      for (let idx = 0; idx < level.length; idx++) {
        if (isSafeLevel(level.toSpliced(idx, 1))) {
          return true
        }
      }

      return false
    }).length
}

function parse(input: string) {
  return input.split(/\s+/).map(Number)
}
