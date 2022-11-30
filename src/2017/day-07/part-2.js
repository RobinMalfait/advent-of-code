function resolvedNodes(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes[i].children.length; j++) {
      nodes[i].children[j] = nodes.find((n) => n.name === nodes[i].children[j])
    }
  }

  return nodes
}

function depth(node) {
  let total = 1

  for (let child of node.children) {
    total += depth(child)
  }

  return total
}

function weight(node) {
  let total = node.weight

  for (let child of node.children) {
    total += weight(child)
  }

  return total
}

export default function (blob) {
  let nodes = blob
    .trim()
    .split('\n')
    .map((line) => {
      let {
        groups: { name, weight, children = '' },
      } = /^(?<name>[^ ]*) \((?<weight>\d*)\)(?: -> (?<children>.*))?$/g.exec(line)
      return { name, weight: Number(weight), children: children.split(', ').filter(Boolean) }
    })

  let [root] = resolvedNodes(nodes)
    .slice()
    .sort((a, z) => depth(z) - depth(a))

  let weights = root.children.map((node) => ({ ...node, total: weight(node) }))
  let weirdo = weights.reduce((acc, n) => {
    acc[n.total] ??= 0
    acc[n.total]++
    return acc
  }, {})

  let [weird, normal] = Object.entries(weirdo)
    .sort((a, z) => a[1] - z[1])
    .map(([weight]) => Number(weight))
  let offset = weird - normal

  let weirdNode = weights.find((n) => n.total === weird)

  return weirdNode.weight - offset
}
