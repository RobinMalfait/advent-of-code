export default function (blob: string) {
  return sumJSONNumbers(JSON.parse(blob))
}

function sumJSONNumbers(input: unknown): number {
  let sum = 0

  if (typeof input === 'number') {
    sum += input
  } else if (Array.isArray(input)) {
    sum += input.reduce((acc, item) => acc + sumJSONNumbers(item), 0)
  } else if (typeof input === 'object') {
    sum += Object.values(input).reduce(
      (acc: number, item) => acc + sumJSONNumbers(item),
      0,
    ) as number
  }

  return sum
}
