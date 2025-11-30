export default function (blob) {
  return blob
    .trim()
    .split('\n')
    .map((row) =>
      row
        .split(/\s+/g)
        .map(Number)
        .sort((a, z) => z - a),
    )
    .map((row) => {
      for (let i = 0; i <= row.length; i++) {
        for (let j = i + 1; j <= row.length; j++) {
          if (row[i] % row[j] === 0) {
            return row[i] / row[j]
          }
        }
      }
      return 0
    })
    .reduce((total, current) => total + current, 0)
}
