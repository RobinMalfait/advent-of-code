export default function (blob) {
  let [ruleBlob, messageBlob] = blob.trim().split('\n\n')
  let rules = parseRules(ruleBlob)

  // return originalApproach(rules, messageBlob)

  let r = new RegExp(`^(${createRegex(rules, 0)})$`)
  return messageBlob.split('\n').filter((message) => r.test(message)).length
}

function createRegex(rules, idx) {
  if (Array.isArray(rules[idx])) {
    return `(${rules[idx].map((rule) => createRegex(rules, rule)).join('|')})`
  }

  if (Array.isArray(idx)) {
    return idx.map((p) => createRegex(rules, p)).join('')
  }

  return idx
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
        }),
      ),
    )
  }

  return lookup
}

function originalApproach(rules, messageBlob) {
  console.table(rules)
  console.table([messageBlob])

  function isValid(message, ref, offset = 0, depth = 0, validIndexes = []) {
    // console.log({message, offset, technically: message.slice(offset)})

    let valid = rules[ref].some((options) => {
      let shared_state = 0
      return options.every((rule, i) => {
        let idx = i + offset + shared_state
        if (rules[rule]) {
          let nestedValid = isValid(message, rule, idx, depth + 1, validIndexes)
          if (nestedValid) {
            shared_state += i
          }
          return nestedValid
        }

        console.log({ message, at: idx })
        let valid = rule === message[idx]
        if (valid) {
          validIndexes.push(idx)
          shared_state += i
        }
        return valid
      })
    })

    if (depth === 0) {
      console.log(validIndexes, message)
      return valid && Math.max(...validIndexes) === message.length - 1
    }

    return valid
  }

  return messageBlob.split('\n').filter((message) => isValid(message, 0)).length
}
