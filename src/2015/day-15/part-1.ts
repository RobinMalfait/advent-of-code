export default function (blob: string, teaspoons = 100) {
  let ingredients = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  // Ignore calories
  for (let ingredient of ingredients) {
    ingredient.properties.delete('calories')
  }

  let score = 0
  for (let weights of divide(teaspoons, ingredients.length)) {
    let matrix = ingredients.map((ingredient) => [...ingredient.properties.values()])
    let total = multiply(transpose(matrix), transpose([weights]))
      .flat()
      .map((v) => Math.max(v, 0))
      .reduce((a, b) => a * b, 1)

    score = Math.max(score, total)
  }

  return score
}

function parse(input: string) {
  let [ingredient, rawProperties] = input.split(': ')
  let properties = new Map(
    rawProperties.split(', ').map((property) => {
      let [name, amount] = property.split(' ')
      return [name, Number(amount)]
    })
  )

  return { ingredient, properties }
}

function multiply(a: number[][], b: number[][]): number[][] {
  let result: number[][] = []
  for (let i = 0; i < a.length; i++) {
    result[i] = []
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0
      for (let k = 0; k < a[0].length; k++) {
        sum += a[i][k] * b[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

function transpose<T>(grid: T[][]) {
  return grid[0].map((_, i) => grid.map((row) => row[i]))
}

function* divide(amount: number, parts: number): Generator<number[]> {
  if (parts === 1) {
    yield [amount]
  } else {
    for (let i = 1; i < amount; i++) {
      for (let rest of divide(amount - i, parts - 1)) {
        yield [i, ...rest]
      }
    }
  }
}
