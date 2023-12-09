import { intersection } from 'aoc-utils'

export default function (blob: string) {
  let cards = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .map((card) => intersection(card.winning, card.hand).size)

  let counter: number[] = Array(cards.length).fill(1)

  for (let [idx, points] of cards.entries()) {
    for (let offset = 1; offset <= points; offset++) {
      counter[idx + offset] += counter[idx]
    }
  }

  return counter.reduce((a, b) => a + b, 0)
}

function parse(input: string) {
  let { groups } = /Card \s*(?<id>\d+): (?<winning>.*) \| (?<hand>.*)/g.exec(input)
  return {
    id: Number(groups.id),
    winning: groups.winning.trim().split(/\s+/g).map(Number),
    hand: groups.hand.trim().split(/\s+/g).map(Number),
  }
}
