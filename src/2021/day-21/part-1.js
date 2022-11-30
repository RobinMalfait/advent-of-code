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

  let state = { attempts: 0, die: 0, next: player1 }

  function roll() {
    state.attempts++
    state.die++
    return state.die
  }

  while (![player1, player2].some((player) => player.score >= 1000)) {
    let one = roll()
    let two = roll()
    let three = roll()

    state.next.position = wrap(state.next.position + one + two + three, 1, 10)
    state.next.score += state.next.position

    state.next = state.next === player1 ? player2 : player1
  }

  return Math.min(player1.score, player2.score) * state.attempts
}

function wrap(n, min, max) {
  return ((n - min) % (max + 1 - min)) + min
}
