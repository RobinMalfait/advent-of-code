export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) =>
      line
        .trim()
        .split(',')
        .map((part) => part.split('-').map(Number))
        .map(([start, end]) => ({ start, end }))
    )
    .filter(([lhs, rhs]) => lhs.start <= rhs.end && rhs.start <= lhs.end).length
}
