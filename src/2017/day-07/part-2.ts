export default function (blob: string) {
  let nodes = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let parents = new Map<string, string>(nodes.map((node) => [node.name, null]))

  function weight(name: string) {
    let node = nodes.find((i) => i.name === name)!
    return node.weight + node.dependencies.reduce((total, child) => total + weight(child), 0)
  }

  function* traverse(name: string): Generator<(typeof nodes)[number]> {
    let node = nodes.find((node) => node.name === name)
    yield node

    for (let dependency of node.dependencies) {
      yield* traverse(dependency)
    }
  }

  for (let node of nodes) {
    for (let dependency of node.dependencies) {
      parents.set(dependency, node.name)
    }
  }

  let root = Array.from(parents.keys()).find((name) => parents.get(name) === null)

  for (let node of traverse(root)) {
    let dependencyWeights = node.dependencies.map((d) => weight(d))

    if (!dependencyWeights.every((weight, i, all) => (i === 0 ? true : all[i - 1] === weight))) {
      let [a, b] = new Set(dependencyWeights)

      let oddOneOut = dependencyWeights.filter((x) => x === a).length === 1 ? a : b
      let diff = a - oddOneOut + b - oddOneOut

      let idx = dependencyWeights.indexOf(oddOneOut)
      let grandChildrenWeights = nodes
        .find((n) => n.name === node.dependencies[idx])
        .dependencies.map(weight)

      // The children themselves aren't balanced yet. Can skip this level
      if (
        !grandChildrenWeights.every((weight, i, all) => (i === 0 ? true : all[i - 1] === weight))
      ) {
        continue
      }

      // The children are balanced, so we aren't
      return nodes.find((i) => i.name === node.dependencies[idx]).weight + diff
    }
  }
}

function parse(line: string) {
  let { groups } = /(?<name>.*) \((?<weight>\d+)\)(?: -> (?<dependencies>.*))?/.exec(line)

  return {
    name: groups.name,
    weight: Number(groups.weight),
    dependencies: groups.dependencies ? groups.dependencies.split(', ') : [],
  }
}
