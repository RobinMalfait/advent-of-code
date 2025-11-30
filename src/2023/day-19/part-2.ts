import { Range, sum } from 'aoc-utils'

type XMAS = { x: Range; m: Range; a: Range; s: Range }

export default function (blob: string) {
  let xmas = {
    x: new Range(1, 4000),
    m: new Range(1, 4000),
    a: new Range(1, 4000),
    s: new Range(1, 4000),
  }

  let workflows = parse(blob)
  let accepted: XMAS[] = []

  let q: [XMAS, string][] = [[xmas, 'in']]

  while (q.length > 0) {
    let [xmas, workflow] = q.shift()

    if (workflow === 'R') continue
    if (workflow === 'A') {
      accepted.push(xmas)
      continue
    }

    let conditions = workflows.get(workflow)
    for (let condition of conditions) {
      if (condition.type === 'direct') {
        q.push([xmas, condition.target])
      } else {
        let part: Range = xmas[condition.key]
        let offset = condition.type === '<' ? 0 : 1
        let [lhs, rhs] = part.split(condition.value + offset)

        xmas[condition.key] = condition.type === '<' ? rhs : lhs

        q.push([{ ...xmas, [condition.key]: condition.type === '<' ? lhs : rhs }, condition.target])
      }
    }
  }

  return sum(
    accepted.map((rating) => rating.x.size * rating.m.size * rating.a.size * rating.s.size),
  )
}

function parse(input: string) {
  let [workflows] = input.trim().split('\n\n')
  return new Map(workflows.split('\n').map((line) => parseWorkflow(line.trim())))
}

function parseWorkflow(input: string) {
  let result = /(?<name>.*){(?<rules>.*)}/.exec(input)
  let conditions = result.groups.rules.split(',').map((rule) => parseRule(rule.trim()))
  return [result.groups?.name, conditions] as const
}

function parseRule(input: string) {
  let parts = input.split(':')
  if (parts.length === 1) {
    return { type: 'direct', target: parts[0] }
  }

  let [condition, target] = parts
  let [key, operator, valueString] = condition.split(/([<>]=?)/).map((x) => x.trim())
  let value = Number(valueString)
  return { type: operator, key, value, target }
}
