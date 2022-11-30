export default function (blob) {
  let players = blob
    .trim()
    .split('\n\n')
    .map((section) => section.split('\n'))
    .map(([_, ...cards]) => ({ deck: cards.map(Number) }))

  while (players.every(({ deck }) => deck.length > 0)) {
    let tops = players
      .map((player) => player.deck.shift())
      .map((card, i) => [i, card])
      .sort((a, z) => z[1] - a[1])

    players[tops[0][0]].deck.push(...tops.map(([, card]) => card))
  }

  let winner = players.find((player) => player.deck.length > 0)
  return winner.deck.reduce((total, current, i, list) => total + current * (list.length - i), 0)
}
