export default function (blob: string) {
  let initialSecretNumbers = blob
    .trim()
    .split('\n')
    .map((line) => BigInt(line.trim()))

  let total = 0n
  for (let secret of initialSecretNumbers) {
    let steps = 2000
    while (steps-- > 0) {
      secret = compute(secret)
    }

    total += secret
  }
  return Number(total)
}

function compute(secret: bigint) {
  secret = prune(mix(secret, secret * 64n))
  secret = prune(mix(secret, secret / 32n))
  secret = prune(mix(secret, secret * 2048n))
  return secret
}

function mix(secret: bigint, input: bigint) {
  return secret ^ input
}

function prune(input: bigint) {
  return input % 16_777_216n
}
