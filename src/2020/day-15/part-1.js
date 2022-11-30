export default function (blob, n = 2020) {
  let numbers = blob.trim().split(',').map(Number)

  let lastLastSeen = new Map()
  let lastSeen = new Map()

  let last = numbers[numbers.length - 1]

  for (let [idx, number] of numbers.entries()) {
    lastSeen.set(number, idx)
  }

  for (let i = numbers.length; i < n; i++) {
    let next = 0

    if (lastLastSeen.has(last) && lastSeen.has(last)) {
      next = lastSeen.get(last) - lastLastSeen.get(last)
    }

    last = next

    if (lastSeen.has(next)) {
      lastLastSeen.set(next, lastSeen.get(next))
    }

    lastSeen.set(next, i)
  }

  return last
}
