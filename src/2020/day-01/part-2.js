export default function (blob) {
  let values = blob.split('\n').map(Number)
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      for (let k = j + 1; k < values.length; k++) {
        if (values[i] + values[j] + values[k] === 2020) {
          return values[i] * values[j] * values[k]
        }
      }
    }
  }

  return -1
}
