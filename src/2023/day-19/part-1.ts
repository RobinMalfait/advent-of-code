import { sum } from 'aoc-utils'

type XMAS = { x: number; m: number; a: number; s: number }

export default function (blob: string) {
  let [workflows, ratings] = parse(blob)
  let accepted: XMAS[] = []
  for (let rating of ratings) {
    let name = 'in'
    while (name !== 'A' && name !== 'R') {
      name = workflows.get(name)(rating)
    }

    if (name === 'A') {
      accepted.push(rating)
    }
  }

  return sum(accepted.map((rating) => rating.x + rating.m + rating.a + rating.s))
}

function parse(input: string) {
  let [workflows, ratings] = input.trim().split('\n\n')
  return [
    new Map(workflows.split('\n').map((line) => parseWorkflow(line.trim()))),
    ratings.split('\n').map((line) => parseRating(line.trim())),
  ] as const
}

function parseWorkflow(input: string) {
  let result = /(?<name>.*){(?<rules>.*)}/.exec(input)
  let conditions = result.groups.rules.split(',').map((rule) => parseRule(rule.trim()))
  return [
    result.groups?.name,
    (xmas: XMAS) => {
      let result: string | null = null
      for (let condition of conditions) {
        result = condition(xmas)
        if (result !== null) return result
      }
      return result
    },
  ] as const
}

function parseRating(input: string): XMAS {
  return Object.assign(
    { x: 0, m: 0, a: 0, s: 0 },
    Object.fromEntries(
      input
        .slice(1, -1)
        .split(',')
        .map((pair) => pair.split('='))
        .map(([key, value]) => [key.trim(), Number(value.trim())])
    )
  )
}

function parseRule(input: string): (xmas: XMAS) => string | null {
  let parts = input.split(':')
  if (parts.length === 1) {
    return () => parts[0]
  }

  let [condition, target] = parts
  let [key, operator, valueString] = condition.split(/([<>]=?)/).map((x) => x.trim())
  let value = Number(valueString)
  return (xmas: XMAS) => {
    if (operator === '<') {
      return xmas[key] < value ? target : null
    } else if (operator === '>') {
      return xmas[key] > value ? target : null
    } else {
      throw new Error(`Unknown operator ${operator}`)
    }
  }
}
