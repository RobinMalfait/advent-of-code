// Day 22: Slam Shuffle

const MINUS_ONE = BigInt(-1)
const ZERO = BigInt(0)
const ONE = BigInt(1)
const TWO = BigInt(2)

module.exports = (input, size, times, card) => {
  const cardn = BigInt(card)
  const sizen = BigInt(size)
  const timesn = BigInt(times)

  let a = ONE
  let b = ZERO
  for (let action of input.split('\n').reverse()) {
    if (action.startsWith('deal into new stack')) {
      b = mod(b + ONE, cardn)
      a = mod(a * MINUS_ONE, cardn)
      b = mod(b * MINUS_ONE, cardn)
    } else if (action.startsWith('deal with increment')) {
      const amount = BigInt(action.split(' ').pop())
      const p = pow(amount, sizen - TWO, sizen)

      a = mod(a * p, cardn)
      b = mod(b * p, cardn)
    } else if (action.startsWith('cut')) {
      const amount = BigInt(action.split(' ').pop())
      b = mod(b + amount, cardn)
    }

    // a = mod(a % sizen, cardn)
    // b = mod(b % sizen, cardn)
    a %= sizen
    b %= sizen
  }

  return (
    (pow(a, timesn, sizen) * cardn +
      b * (pow(a, timesn, sizen) + sizen - ONE) * pow(a - ONE, sizen - TWO, sizen)) %
    sizen
  )
}

function mod(v, N) {
  return ((v % N) + N) % N
}

function pow(a, b, N) {
  a = a % N
  let r = BigInt(1)
  let x = a

  while (b > BigInt(0)) {
    const lsb = b % BigInt(2)
    b = b / BigInt(2)
    if (lsb == BigInt(1)) {
      r *= x
      r %= N
    }
    x *= x
    x %= N
  }
  return r
}
