export default function (blob) {
  let [ruleBlob, messageBlob] = blob.trim().split('\n\n')
  let rules = parseRules(ruleBlob)

  // Redefine some of the rules
  rules[8] = [[42], [42, 8]]
  rules[11] = [
    [42, 31],
    [42, 11, 31],
  ]

  let r42 = createRegex(rules, 42)
  let r31 = createRegex(rules, 31)

  let r = new RegExp(`^(${createRegex(rules, 0)})$`)

  return messageBlob.split('\n').filter((message) => r.test(message)).length

  function createRegex(rules, idx) {
    if (idx === 8) return `(${r42})+`
    if (idx === 11) {
      return (
        '(' +
        Array.from(Array(5)) // I am ashamed.
          .map((_, i) => `(${r42.repeat(i + 1)})(${r31.repeat(i + 1)})`)
          .join('|') +
        ')'
      )
    }

    if (Array.isArray(rules[idx])) {
      return '(' + rules[idx].map((rule) => createRegex(rules, rule)).join('|') + ')'
    }

    if (Array.isArray(idx)) {
      return idx.map((p) => createRegex(rules, p)).join('')
    }

    return idx
  }
}

function parseRules(blob) {
  let lines = blob.split('\n')
  let lookup = {}

  for (let line of lines) {
    let [name, ...definition] = line.split(': ')
    lookup[name] = definition.flatMap((rule) =>
      rule.split(' | ').map((subrules) =>
        subrules.split(' ').flatMap((character) => {
          if (character.startsWith('"') && character.endsWith('"')) {
            return character.slice(1, -1) // Literal character
          }

          return Number(character) // Reference to other rule
        })
      )
    )
  }

  return lookup
}
