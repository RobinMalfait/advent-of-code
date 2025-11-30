export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .sort(([a], [z]) => type(a) - type(z) || rank(a, z))
    .reduce((acc, [, bid], rank, all) => acc + bid * (all.length - rank), 0)
}

let seen = new Map()
function type(cards: string[]) {
  let key = cards.join('')
  if (seen.has(key)) return seen.get(key)

  let countsObj = cards.reduce(
    (acc, card) => {
      acc[card] ??= 0
      acc[card] += 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Move joker counts to the highest card
  if (countsObj.J) {
    let highest = null
    for (let [card, count] of Object.entries(countsObj)) {
      if (card === 'J') continue

      if (highest === null || countsObj[highest] < count) {
        highest = card
      }
    }
    if (highest !== null) {
      countsObj[highest] += countsObj.J
      countsObj.J = undefined
    }
  }

  let counts = Object.values(countsObj).sort((a, z) => z - a)

  // Five of a kind
  if (counts[0] === 5) seen.set(key, 1)
  // Four of kind
  else if (counts[0] === 4) seen.set(key, 2)
  // Full house
  else if (counts[0] === 3 && counts[1] === 2) seen.set(key, 3)
  // Three of a kind
  else if (counts[0] === 3) seen.set(key, 4)
  // Two pair
  else if (counts[0] === 2 && counts[1] === 2) seen.set(key, 5)
  // One pair
  else if (counts[0] === 2) seen.set(key, 6)
  // High card
  else seen.set(key, 7)

  return seen.get(key)
}

let order = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J']
function rank(a: string[], z: string[]) {
  for (let i = 0; i < a.length; i++) {
    let aIdx = order.indexOf(a[i])
    let zIdx = order.indexOf(z[i])
    if (aIdx !== zIdx) {
      return aIdx - zIdx
    }
  }

  return 0
}

function parse(input: string): [cards: string[], bid: number] {
  let [cards, bid] = input.split(' ')
  return [cards.split(''), Number(bid)]
}
