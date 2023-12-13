export default function (blob: string, rounds = 1, decryption_key = 1) {
  let numbers = blob
    .trim()
    .split('\n')
    .map(Number)
    .map((x) => x * decryption_key)
  let total = numbers.length
  let locations = [...Array(total).keys()]

  for (let _ of Array(rounds)) {
    for (let [idx, value] of numbers.entries()) {
      let previous_idx = locations.findIndex((value) => value === idx)

      // Drop old value
      locations.splice(previous_idx, 1)

      // Calculate new idx
      let new_idx = previous_idx
      new_idx += value
      new_idx %= total - 1
      new_idx += total - 1
      new_idx %= total - 1

      // Store new value
      locations.splice(new_idx, 0, idx)
    }
  }

  let sorted_numbers = locations.map((idx) => numbers[idx])
  let position_0 = sorted_numbers.indexOf(0)

  return [1000, 2000, 3000]
    .map((offset) => sorted_numbers[(position_0 + offset) % total])
    .reduce((total, current) => total + current)
}
