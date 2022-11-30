export default function (blob) {
  let players = blob
    .trim()
    .split('\n\n')
    .map((section) => section.split('\n'))
    .map(([, ...cards]) => cards.map(Number))

  return game(players)[1].reduce((total, current, i, list) => total + current * (list.length - i), 0)

  function game(players) {
    let seen = new Map()
    let winnerIdx = 0

    while (players.every((deck) => deck.length > 0)) {
      for (let player of players) {
        if (seen.has(player.join(','))) return [0, players[0]]
        else seen.set(player.join(','), true)
      }

      let topCards = players.map((player) => player.shift())

      if (topCards.every((card, i) => players[i].length >= card)) {
        winnerIdx = game(players.map((player, i) => player.slice(0, topCards[i])))[0]
      } else {
        winnerIdx = topCards.map((card, i) => [i, card]).sort((a, z) => z[1] - a[1])[0][0]
      }

      // Logically, the winner is the first one in the tops list (sorted).
      // However, it could be that the other person won because of subgames. In
      // that case, we have to reverse the top cards.
      if (winnerIdx !== 0) topCards.reverse()
      players[winnerIdx].push(...topCards.map((card) => card))
    }

    return [winnerIdx, players[winnerIdx]]
  }
}
