export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .map((history) => previous(history))
    .reduce((a, b) => a + b, 0)
}

function previous(history: number[]) {
  let sum = 0
  let diffs = Array.from(windows(history, 2)).map(([a, b]) => b - a)
  if (!diffs.every((d) => d === 0)) {
    sum += previous(diffs)
  }
  return history[0] - sum
}

function* windows<T>(input: T[], size: number) {
  for (let i = 0; i <= input.length - size; i++) {
    yield input.slice(i, i + size)
  }
}

function parse(input: string) {
  return input.split(/\s+/g).map(Number)
}
