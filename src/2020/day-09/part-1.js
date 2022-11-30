export default function (blob, preamble = 25) {
  let numbers = Array.isArray(blob) ? blob : blob.trim().split('\n').map(Number)

  for (let i = preamble; i < numbers.length; i++) {
    let value = numbers[i]
    let options = numbers.slice(i - preamble, i)

    if (!options.some((option) => options.includes(value - option))) {
      return value
    }
  }

  return -1
}
