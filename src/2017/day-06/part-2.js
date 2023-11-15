function findIndexOfLargestNumber(data) {
  let [highestValue] = data.slice().sort((a, z) => z - a)
  return data.indexOf(highestValue)
}

export default function (blob) {
  let memoryBanks = blob.trim().split('\t').map(Number)
  let seen = new Set([])

  let next = memoryBanks.slice()
  while (!seen.has(next.join(','))) {
    seen.add(next.join(','))

    next = next.slice()
    let idx = findIndexOfLargestNumber(next)
    let amount = next[idx]

    next[idx] = 0

    for (let i = 0; i < amount; i++) {
      next[(idx + i + 1) % next.length] += 1
    }
  }

  return seen.size
}
