export default function (blob) {
  let [rules, mine, nearby] = blob.trim().split('\n\n')
  rules = validationRules(rules)
  mine = parseTickets(mine)[0]
  nearby = parseTickets(nearby)

  let possibleOrder = Array.from({ length: rules.length }).map(() => rules.map((rule) => rule.name))

  // Drop fields if it is not valid for a certain value
  outer: for (let other of nearby) {
    for (let number of other) {
      if (!isValid(number, rules)) continue outer // Ignoring invalid tickets
    }

    for (let [valueIdx, value] of other.entries()) {
      for (let rule of rules) {
        if (rule.isValid(value)) continue

        let fieldIdx = possibleOrder[valueIdx].indexOf(rule.name)
        if (fieldIdx === -1) continue

        possibleOrder[valueIdx].splice(fieldIdx, 1)
      }
    }
  }

  let order = dedupeOrder(possibleOrder)

  let total = 1
  for (let [idx, field] of order.entries()) {
    if (!field.startsWith('departure')) continue
    total *= mine[idx]
  }

  return total
}

function dedupeOrder(possibleOrder) {
  let repeat = false
  for (let [idx, fields] of possibleOrder.entries()) {
    if (fields.length !== 1) continue

    let value = fields[0]
    possibleOrder[idx] = value

    for (let [otherIndex, otherFields] of possibleOrder.entries()) {
      if (otherIndex === idx) continue

      let fieldIdx = otherFields.indexOf(value)
      if (fieldIdx === -1) continue

      possibleOrder[otherIndex].splice(fieldIdx, 1)
      repeat = true
    }
  }

  if (repeat) return dedupeOrder(possibleOrder)
  return possibleOrder
}

function validationRules(raw) {
  let rules = raw.split('\n').map((rule) => {
    let [name, ranges] = rule.split(': ')
    let validators = ranges
      .split(' or ')
      .map((range) => range.split('-').map(Number))
      .map(
        ([min, max]) =>
          (value) =>
            value >= min && value <= max
      )

    return {
      name,
      isValid: (value) => validators.some((valid) => valid(value)),
    }
  })

  return rules
}

function isValid(value, rules) {
  return rules.some((rule) => rule.isValid(value))
}

function parseTickets(raw) {
  return raw
    .split('\n')
    .slice(1)
    .map((ticket) => ticket.split(',').map(Number))
}
