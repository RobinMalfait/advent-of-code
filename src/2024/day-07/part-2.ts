import { sum } from 'aoc-utils'

export default function (blob: string) {
  return sum(
    blob
      .trim()
      .split('\n')
      .map((line) => solve(parse(line.trim()))),
  )
}

function solve([target, ...args]: number[]) {
  let results = [args.shift()]

  for (let arg of args) {
    for (let result of results.splice(0)) {
      let add = result + arg
      if (add <= target) results.push(add)

      let mul = result * arg
      if (mul <= target) results.push(mul)

      let concat =
        arg < 10
          ? result * 10 + arg
          : arg < 100
            ? result * 100 + arg
            : arg < 1000
              ? result * 1000 + arg
              : Number(`${result}${arg}`)
      if (concat <= target) results.push(concat)
    }
  }

  return results.includes(target) ? target : 0
}

function parse(input: string) {
  return input.split(/[: ]+/g).map(Number)
}
