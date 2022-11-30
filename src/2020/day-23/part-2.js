export default function (blob, rounds = 10_000_000) {
  let cups = blob.trim().split('').map(Number)
  let max = Math.max(...cups)
  let total = 1_000_000 - cups.length
  let byValue = new Map()

  // We need upto 1 million cups
  for (let i = 1; i <= total; i++) cups.push(max + i)

  // Setup the world
  let next = new Node(cups[0])
  let veryFirst = next
  byValue.set(next.value, next)
  for (let i = 1; i < cups.length; i++) {
    let node = new Node(cups[i], next)
    byValue.set(node.value, node)
    next.next = node
    next = node
  }

  // Wrap around
  next.next = veryFirst

  let highestValues = cups
    .slice(-4)
    .reverse()
    .map((label) => byValue.get(label))

  let current = next
  for (let i = 0; i < rounds; i++) {
    current = current.next

    // Pick 3
    let a = current.next
    let b = a.next
    let c = b.next

    // Re-link
    current.next = c.next

    let destinationValue = current.value - 1
    while (a.value === destinationValue || b.value === destinationValue || c.value === destinationValue) destinationValue--
    let destination = destinationValue > 0 ? byValue.get(destinationValue) : highestValues.find((node) => node !== a && node !== b && node !== c)

    // Re-insert
    c.next = destination.next
    destination.next = a
  }

  let firstCup = byValue.get(1)
  return firstCup.next.value * firstCup.next.next.value
}

class Node {
  constructor(value, next = null) {
    Object.assign(this, { value, next })
  }
}
