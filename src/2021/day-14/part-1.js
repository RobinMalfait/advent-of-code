export default function (blob, steps = 10) {
  let [template, pairInsertions] = blob.trim().split('\n\n')
  template = template.split('')
  pairInsertions = new Map(
    pairInsertions
      .split('\n')
      .map((rule) => rule.split(' -> '))
      .map(([pair, insertion]) => [toId(...pair.split('')), insertion]),
  )

  //
  let counts = new Map()
  for (let [lhs, rhs] of windows(2, template)) {
    inc(toId(lhs, rhs), counts)
  }

  //
  for (let _ of Array(steps)) {
    let nextCounts = new Map()
    for (let [id, total] of counts.entries()) {
      let [lhs, rhs] = fromId(id)

      let insertion = fromId(pairInsertions.get(id))
      inc(toId(lhs, insertion), nextCounts, total)
      inc(toId(insertion, rhs), nextCounts, total)
    }

    counts = nextCounts
  }

  //
  let countsPerCharacter = new Map()
  for (let [pair, total] of counts.entries()) {
    let lhs = fromId(pair).shift()
    inc(lhs, countsPerCharacter, total)
  }

  // Increment last character since we missed that in the loop above
  inc(template[template.length - 1], countsPerCharacter)

  return Math.max(...countsPerCharacter.values()) - Math.min(...countsPerCharacter.values())
}

function inc(key, map, incrementBy = 1, defaultValue = incrementBy) {
  if (map.has(key)) {
    map.set(key, map.get(key) + incrementBy)
  } else {
    map.set(key, defaultValue)
  }
}

// Sigh... I wish we could use tuples as a key...
function toId(a, b) {
  return [a, b].join(',')
}

function fromId(id) {
  return id.split(',')
}

function* windows(n, arr) {
  for (let i = 0; i <= arr.length - n; i++) {
    yield arr.slice(i, i + n)
  }
}
