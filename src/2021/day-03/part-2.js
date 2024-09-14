export default function (blob) {
  let binaries = blob.trim().split('\n')
  let numbers = binaries.map((line) => Number.parseInt(line.trim(), 2))
  let bits = binaries[0].length

  let state = {
    gamma: numbers.slice(),
    epsilon: numbers.slice(),
  }

  let prefer = {
    gamma: 1,
    epsilon: 0,
  }

  for (let i = bits - 1; i >= 0; i--) {
    for (let rating of Object.keys(state)) {
      let numbers = state[rating]
      if (numbers.length === 1) {
        continue
      }

      let ones = 0
      let zeros = 0

      let mask = 1 << i

      for (let number of numbers) {
        number & mask ? ones++ : zeros++
      }

      state[rating] = numbers.filter((x) => {
        let sign = (ones >= zeros) ^ prefer[rating]
        return sign ? x & mask : !(x & mask)
      })
    }
  }

  return state.gamma[0] * state.epsilon[0]
}
