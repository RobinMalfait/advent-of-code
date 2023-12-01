export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .map((numbers) => numbers.at(0) * 10 + numbers.at(-1))
    .reduce((a, b) => a + b, 0)
}

let words = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
function parse(input: string) {
  let result = []

  for (let [idx, v] of input.split('').entries()) {
    if (/\d/.test(v)) result.push(v)
    else {
      let iidx = words.findIndex((word) => input.slice(idx).startsWith(word))
      if (iidx !== -1) result.push(iidx + 1)
    }
  }

  return result.map(Number)
}
