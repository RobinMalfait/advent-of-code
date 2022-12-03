export default function (blob: string) {
  return chunks(
    blob
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .map((line) => new Set(line.split(''))),
    3
  )
    .map((sets) => {
      for (let value of sets.pop() ?? []) {
        if (sets.every((set) => set.has(value))) {
          return value
        }
      }
    })
    .map((letter = '') => {
      if (/[a-z]/g.test(letter)) return letter.charCodeAt(0) - 96
      if (/[A-Z]/g.test(letter)) return letter.charCodeAt(0) - 38
      return 0
    })
    .reduce((total, current) => total + current)
}

function chunks<T>(arr: T[], amount = 1): T[][] {
  let chunked: T[][] = []

  for (let i = 0; i < arr.length; i += amount) {
    chunked.push(arr.slice(i, i + amount))
  }

  return chunked
}
