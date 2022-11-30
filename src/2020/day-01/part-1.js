export default function (blob) {
  let values = blob.split('\n').map(Number)
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      if (values[i] + values[j] === 2020) {
        return values[i] * values[j]
      }
    }
  }

  return -1
}
