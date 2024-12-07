export default function (blob: string) {
  return chunks(
    blob
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .map((line) => new Set(line.split(''))),
    3
  )
    .map((sets) => Array.from(sets.pop()).find((value) => sets.every((set) => set.has(value))))
    .map((letter = '') => (letter.charCodeAt(0) & 31) + 26 * Number(/[A-Z]/.test(letter)))
    .reduce((total, current) => total + current)
}

function chunks<T>(arr: T[], amount = 1): T[][] {
  let chunked: T[][] = []

  for (let i = 0; i < arr.length; i += amount) {
    chunked.push(arr.slice(i, i + amount))
  }

  return chunked
}
