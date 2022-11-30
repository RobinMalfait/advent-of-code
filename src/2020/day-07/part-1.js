function containsBag(name, query, lookup, cache) {
  if (cache.has(name)) return cache.get(name)

  if (lookup[name].includes(query)) {
    cache.set(name, true)
    return true
  }

  let contains = lookup[name].some((bag) => containsBag(bag, query, lookup, cache))
  cache.set(name, contains)
  return contains
}

export default function (blob, bag = 'shiny gold') {
  let nodes = blob
    .trim()
    .split('\n')
    .map((line) => line.split('bags contain').map((v) => v.trim()))
    .map(([name, bags]) => [
      name,
      bags
        .split(', ')
        .map((bag) => (bag.includes('no') ? null : /\d+ (?<name>.*) bags?/g.exec(bag).groups.name))
        .filter(Boolean),
    ])

  let lookup = Object.fromEntries(nodes)
  let cache = new Map()
  return nodes.filter(([name]) => containsBag(name, bag, lookup, cache)).length
}
