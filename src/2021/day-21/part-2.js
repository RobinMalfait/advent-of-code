export default function (blob) {
  let [player1pos, player2pos] = blob
    .trim()
    .split('\n')
    .map((player) => player.split(': ').pop())
    .map(Number)

  let player1 = {
    position: player1pos,
    score: 0,
  }

  let player2 = {
    position: player2pos,
    score: 0,
  }

  let DP = new Map()
  function universe(player1, player2) {
    if (player1.score >= 21) return { player1wins: 1, player2wins: 0 }
    if (player2.score >= 21) return { player1wins: 0, player2wins: 1 }

    let id = key(player1, player2)
    if (DP.has(id)) return DP.get(id)

    let state = { player1wins: 0, player2wins: 0 }

    for (let one of [1, 2, 3]) {
      for (let two of [1, 2, 3]) {
        for (let three of [1, 2, 3]) {
          let next = { ...player1 }

          next.position = wrap(player1.position + one + two + three, 1, 10)
          next.score += next.position

          let nextState = universe(player2, next)

          state.player1wins += nextState.player2wins
          state.player2wins += nextState.player1wins
        }
      }
    }

    DP.set(key(player1, player2), state)

    return state
  }

  let state = universe(player1, player2)
  return Math.max(state.player1wins, state.player2wins)
}

function key(player1, player2) {
  return [player1.position, player1.score, player2.position, player2.score].join(';')
}

function wrap(n, min, max) {
  return ((n - min) % (max + 1 - min)) + min
}
