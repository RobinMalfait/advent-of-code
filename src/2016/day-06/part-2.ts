export default function (blob: string) {
  return transpose(
    blob
      .trim()
      .split('\n')
      .map((line) => line.trim().split(''))
  )
    .map((characters) =>
      characters
        .sort()
        .join('')
        .match(/(.)\1*/g)
        .sort((a, z) => a.length - z.length)
        .at(0)
        .at(0)
    )
    .join('')
}

function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]))
}
