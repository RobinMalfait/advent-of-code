enum State {
  Lit = '█',
  Dark = '░',
}

export default function (blob: string, width = 50, height = 6) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let grid = Array(height)
    .fill(null)
    .map(() => Array(width).fill(State.Dark))

  for (let instruction of instructions) {
    if (instruction.type === 'rect') {
      for (let row of Array(instruction.height).keys()) {
        for (let column of Array(instruction.width).keys()) {
          grid[row][column] = State.Lit
        }
      }
    } else if (instruction.type === 'rotate') {
      if (instruction.direction === 'column') {
        grid = transpose(grid)
      }

      for (let _ of Array(instruction.amount)) {
        grid[instruction.idx].unshift(grid[instruction.idx].pop())
      }

      if (instruction.direction === 'column') {
        grid = transpose(grid)
      }
    }
  }

  return `\n${grid.map((rows) => rows.join('')).join('\n')}\n`
}

function parse(
  input: string
):
  | { type: 'rect'; width: number; height: number }
  | { type: 'rotate'; direction: 'row' | 'column'; idx: number; amount: number } {
  let tokens = input.split(' ')
  if (tokens[0] === 'rect') {
    let [w, h] = tokens[1].split('x').map(Number)
    return { type: 'rect', width: w, height: h }
  }
  if (tokens[0] === 'rotate') {
    let idx = tokens[2].split('=').map(Number).pop()
    let amount = Number(tokens[4])
    return { type: 'rotate', direction: tokens[1] as 'row' | 'column', idx: Number(idx), amount }
  }

  console.log('TODO', input)
  throw new Error('Not implemented yet.')
}

function transpose<T>(matrix: T[][]) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]))
}
