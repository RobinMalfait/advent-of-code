export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .map((numbers) => numbers.at(0) * 10 + numbers.at(-1))
    .reduce((a, b) => a + b, 0)
}

function parse(input: string) {
  return Array.from(input.matchAll(/\d/g)).map(Number)
}
