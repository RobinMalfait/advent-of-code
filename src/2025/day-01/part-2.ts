export default function (blob: string) {
  let actions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let dial = 50
  let zeroes = 0

  for (let { dir, amount } of actions) {
    if (dir === 'L') {
      for (let i = 1; i <= amount; i++) {
        dial -= 1
        if (dial === 0) zeroes += 1
        if (dial < 0) dial += 100
      }
    } else if (dir === 'R') {
      for (let i = 1; i <= amount; i++) {
        dial += 1
        if (dial >= 100) dial -= 100
        if (dial === 0) zeroes += 1
      }
    }
  }

  return zeroes
}

function parse(input: string) {
  let [, dir, amount] = /(L|R)(\d+)/.exec(input)
  return { dir, amount: Number(amount) }
}
