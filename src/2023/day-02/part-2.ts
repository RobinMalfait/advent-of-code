export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .map((game) => {
      let maxR = game.rounds.reduce((a, b) => Math.max(a, b.red), 0)
      let maxG = game.rounds.reduce((a, b) => Math.max(a, b.green), 0)
      let maxB = game.rounds.reduce((a, b) => Math.max(a, b.blue), 0)
      return maxR * maxG * maxB
    })
    .reduce((a, b) => a + b, 0)
}

function parse(input: string): { id: number; rounds: { red: number; green: number; blue: number }[] } {
  let [game, sets] = input.split(': ')
  return {
    id: Number(game.replace('Game ', '')),
    rounds: sets.split(';').map((bag) =>
      Object.assign(
        { red: 0, green: 0, blue: 0 },
        Object.fromEntries(
          bag
            .split(',')
            .map((cube) => cube.trim().split(' '))
            .map(([amount, color]) => [color, Number(amount)])
        )
      )
    ),
  }
}
