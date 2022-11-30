function countBags(lookup, query) {
  return lookup[query].reduce((total, bag) => total + Number(bag.amount) * countBags(lookup, bag.name), 1)
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
        .map((bag) => (bag.includes('no') ? null : /(?<amount>\d+) (?<name>.*) bags?/.exec(bag).groups))
        .filter(Boolean),
    ])

  return countBags(Object.fromEntries(nodes), bag) - 1
}
