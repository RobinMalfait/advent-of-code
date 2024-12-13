export default function (blob: string, offset = 0n) {
  let machines = blob
    .trim()
    .split('\n\n')
    .map((line) => parse(line.trim(), offset))

  let total = 0n
  for (let { A, B, prize } of machines) {
    let d = A.x * B.y - A.y * B.x
    let aPresses = (prize.x * B.y - B.x * prize.y) / d
    let bPresses = (A.x * prize.y - prize.x * A.y) / d

    if (
      aPresses * A.x + bPresses * B.x === prize.x &&
      aPresses * A.y + bPresses * B.y === prize.y
    ) {
      total += 3n * aPresses + 1n * bPresses
    }
  }

  return total
}

function parse(input: string, offset = 0n) {
  let [ax, ay, bx, by, px, py] = input.match(/\d+/g).map(BigInt)

  return {
    A: { x: ax, y: ay },
    B: { x: bx, y: by },
    prize: { x: px + offset, y: py + offset },
  }
}
