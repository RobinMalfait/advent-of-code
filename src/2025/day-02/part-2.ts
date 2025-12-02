export default function (blob: string) {
  let ranges = blob
    .trim()
    .replace(/[\n\s]/g, '')
    .split(/\s*,\s*/g)
    .map((range) => parse(range.trim()))

  let total = 0
  for (let [first, last] of ranges) {
    for (let id = first; id <= last; id++) {
      if (isInvalid(id)) {
        total += id
      }
    }
  }

  return total
}

function isInvalid(input: Number) {
  return /^(\d+)\1{1,}$/.test(`${input}`)
}

function parse(range: string) {
  let [, first, last] = /(\d+)-(\d+)/.exec(range)
  return [Number(first), Number(last)]
}
