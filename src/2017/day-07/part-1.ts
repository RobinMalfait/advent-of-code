export default function (blob: string) {
  let nodes = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let parents = new Map<string, string>(nodes.map((node) => [node.name, null]))

  for (let node of nodes) {
    for (let dependency of node.dependencies) {
      parents.set(dependency, node.name)
    }
  }

  for (let [k, v] of parents) {
    if (v === null) {
      return k
    }
  }

  throw new Error('Unreachable.')
}

function parse(line: string) {
  let { groups } = /(?<name>.*) \((?<weight>\d+)\)(?: -> (?<dependencies>.*))?/.exec(line)

  return {
    name: groups.name,
    weight: Number(groups.weight),
    dependencies: groups.dependencies ? groups.dependencies.split(', ') : [],
  }
}
