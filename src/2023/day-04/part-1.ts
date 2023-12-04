export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .map((card) => intersection(card.winning, card.hand))
    .filter((intersection) => intersection.size > 0)
    .map((intersection) => 2 ** (intersection.size - 1))
    .reduce((total, points) => total + points, 0)
}

function intersection<T>(a: T[], b: T[]) {
  return new Set(a.filter((x) => b.includes(x)))
}

function parse(input: string) {
  let { groups } = /Card \s*(?<id>\d+): (?<winning>.*) \| (?<hand>.*)/g.exec(input)
  return {
    id: Number(groups.id),
    winning: groups.winning.trim().split(/\s+/g).map(Number),
    hand: groups.hand.trim().split(/\s+/g).map(Number),
  }
}
