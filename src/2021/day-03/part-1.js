export default function (blob) {
  let binaries = blob.trim().split('\n')
  let numbers = binaries.map((line) => parseInt(line.trim(), 2))
  let bits = binaries[0].length

  let gamma = 0
  let epsilon = 0

  for (let i = bits - 1; i >= 0; i--) {
    let ones = 0
    let zeros = 0

    let mask = 1 << i

    for (let number of numbers) {
      number & mask ? ones++ : zeros++
    }

    if (ones > zeros) {
      gamma |= mask
    } else {
      epsilon |= mask
    }
  }

  return gamma * epsilon
}
