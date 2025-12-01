export default function (blob: string) {
  let actions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let dial = 50
  let zeroes = 0

  for (let { dir, amount } of actions) {
    dial = (dial + dir * amount) % 100

    if (dial === 0) {
      zeroes += 1
    }
  }

  return zeroes
}

function parse(input: string) {
  let [, dir, amount] = /(L|R)(\d+)/.exec(input)
  return { dir: { L: -1, R: 1 }[dir], amount: Number(amount) }
}
