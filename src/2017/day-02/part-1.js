export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .map((row) =>
      row
        .split(/\s+/g)
        .map(Number)
        .sort((a, z) => z - a)
    )
    .map((row) => row.shift() - row.pop())
    .reduce((total, current) => total + current, 0)
}
