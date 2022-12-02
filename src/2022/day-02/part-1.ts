enum Shape {
  Rock,
  Paper,
  Scissors,
}

let winners = new Map([
  [Shape.Rock, Shape.Scissors],
  [Shape.Scissors, Shape.Paper],
  [Shape.Paper, Shape.Rock],
])

function toShape(input: string): Shape {
  if (input === 'A' || input == 'X') return Shape.Rock
  if (input === 'B' || input == 'Y') return Shape.Paper
  if (input === 'C' || input == 'Z') return Shape.Scissors
  throw new Error(`Unknown input: ${input}`)
}

function pointsForShape(shape: Shape): number {
  if (shape === Shape.Rock) return 1
  if (shape === Shape.Paper) return 2
  if (shape === Shape.Scissors) return 3
  throw new Error(`Unknown shape: ${shape}`)
}

enum State {
  Won,
  Lost,
  Draw,
}

function pointsForState(state: State): number {
  if (state === State.Won) return 6
  if (state === State.Draw) return 3
  if (state === State.Lost) return 0
  throw new Error(`Unknown state: ${state}`)
}

function stateFromShapes(left: Shape, right: Shape): State {
  if (left == right) return State.Draw

  for (let [winner, loser] of winners) {
    if (winner === left && loser == right) {
      return State.Won
    }
  }

  return State.Lost
}

export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => line.trim().split(' ').map(toShape))
    .map(([opponent, mine]) => pointsForShape(mine) + pointsForState(stateFromShapes(mine, opponent)))
    .reduce((total, current) => total + current)
}
