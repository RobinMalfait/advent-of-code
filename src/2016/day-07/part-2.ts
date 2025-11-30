export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .filter(supportsSSL).length
}

function parse(line: string): [outsides: string[][], insides: string[][]] {
  return line
    .split(/[\[\]]/g)
    .map((x) => x.split(''))
    .reduce(
      (acc, current, i) => {
        acc[i % 2 === 0 ? 0 : 1].push(current)
        return acc
      },
      [[] as string[][], [] as string[][]],
    )
}

function supportsSSL([outsides, insides]: ReturnType<typeof parse>) {
  for (let [a1, b1] of ABA(outsides)) {
    for (let [a2, b2] of ABA(insides)) {
      if (a1 === b2 && a2 === b1) {
        return true
      }
    }
  }

  return false
}

function* ABA<T>(input: T[][]) {
  for (let group of input) {
    for (let [a, b, c] of windows(3, group)) {
      if (a === c && a !== b) {
        yield [a, b, c].join('')
      }
    }
  }
}

function* windows<T>(n: number, arr: T[]) {
  for (let i = 0; i <= arr.length - n; i++) {
    yield arr.slice(i, i + n)
  }
}
