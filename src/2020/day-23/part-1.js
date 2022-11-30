let PICK_COUNT = 3

export default function (blob, rounds = 100) {
  let cups = blob.trim().split('').map(Number)

  let current = cups[0]
  for (let i = 0; i < rounds; i++) {
    let idx = cups.indexOf(current)

    let picked = cups.splice(idx + 1, PICK_COUNT)
    if (picked.length !== PICK_COUNT) picked.push(...cups.splice(0, PICK_COUNT - picked.length))

    let destination = current - 1
    while (picked.includes(destination)) destination--

    if (!cups.includes(destination)) {
      destination = Math.max(...cups) // Wrap around to highest number
    }

    cups.splice(cups.indexOf(destination), 1, destination, ...picked)
    current = cups[(cups.indexOf(current) + 1) % cups.length]
  }

  return Number(splitAtValue(cups, 1).join(''))
}

export function splitAtValue(array, value) {
  let idx = array.indexOf(value)
  return [...array.slice(idx + 1), ...array.slice(0, idx)]
}
