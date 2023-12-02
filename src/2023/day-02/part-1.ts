export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .filter((game) => game.rounds.every((round) => round.red <= 12 && round.green <= 13 && round.blue <= 14))
    .map((game) => game.id)
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
