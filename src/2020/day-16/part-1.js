export default function (blob) {
  let [rules, mine, nearby] = blob.trim().split('\n\n')
  let isValid = createValidator(rules)
  mine = parseTickets(mine)[0]
  nearby = parseTickets(nearby)

  return nearby
    .flat()
    .filter((value) => !isValid(value))
    .reduce((total, current) => total + current, 0)
}

function createValidator(raw) {
  let rules = raw.split('\n').map((rule) => {
    let validators = rule
      .split(': ')
      .pop()
      .split(' or ')
      .map((range) => range.split('-').map(Number))
      .map(
        ([min, max]) =>
          (value) =>
            value >= min && value <= max
      )

    return (value) => validators.some((valid) => valid(value))
  })

  return (value) => rules.some((valid) => valid(value))
}

function parseTickets(raw) {
  return raw
    .split('\n')
    .slice(1)
    .map((ticket) => ticket.split(',').map(Number))
}
