function* flatten(node) {
  if (node.type === 'leaf') {
    yield node
  } else if (node.type === 'branch') {
    yield* flatten(node.lhs)
    yield* flatten(node.rhs)
  }
}

export function addition(lhs, rhs) {
  let branch = { type: 'branch', parent: lhs.parent, lhs, rhs }
  lhs.parent = branch
  rhs.parent = branch
  return branch
}

function explode(node, tree) {
  let positions = Array.from(flatten(tree))

  // Left most
  if (node.lhs === positions.at(0)) {
    let right = positions[positions.indexOf(node.rhs) + 1]
    right.value += node.rhs.value

    node.parent.lhs = { type: 'leaf', value: 0, parent: node.parent }
  }

  // Right most
  else if (node.rhs === positions.at(-1)) {
    let left = positions[positions.indexOf(node.lhs) - 1]
    left.value += node.lhs.value

    node.parent.rhs = { type: 'leaf', value: 0, parent: node.parent }
  }

  // Somewhere in the middle
  else {
    let left = positions.at(positions.indexOf(node.lhs) - 1)
    let right = positions.at(positions.indexOf(node.rhs) + 1)

    left.value += node.lhs.value
    right.value += node.rhs.value

    if (node.parent.lhs === node) {
      node.parent.lhs = { type: 'leaf', parent: node.parent, value: 0 }
    } else if (node.parent.rhs === node) {
      node.parent.rhs = { type: 'leaf', parent: node.parent, value: 0 }
    }
  }
}

function split(node) {
  let partition = { type: 'branch', parent: node.parent }
  partition.lhs = { type: 'leaf', parent: partition, value: Math.floor(node.value / 2) }
  partition.rhs = { type: 'leaf', parent: partition, value: Math.ceil(node.value / 2) }

  if (node.parent.lhs === node) {
    node.parent.lhs = partition
  } else if (node.parent.rhs === node) {
    node.parent.rhs = partition
  }
}

export function magnitude(node) {
  if (node.type === 'leaf') return node.value
  return magnitude(node.lhs) * 3 + magnitude(node.rhs, 2) * 2
}

function canExplode(node, depth = 0, tree = node) {
  if (node.type === 'leaf') return false

  // 1. If any pair is nested inside four pairs, the leftmost such pair explodes.
  if (node.type === 'branch' && depth > 3) return node

  let leftNodeToExplode = canExplode(node.lhs, depth + 1, tree)
  if (leftNodeToExplode) return leftNodeToExplode

  let rightNodeToExplode = canExplode(node.rhs, depth + 1, tree)
  if (rightNodeToExplode) return rightNodeToExplode

  return false
}

function canSplit(node, depth = 0, tree = node) {
  // 2. If any regular number is 10 or greater, the leftmost such regular number splits.
  if (node.type === 'leaf' && node.value >= 10) return node

  if (node.type === 'branch') {
    let leftNodeToSplit = canSplit(node.lhs, depth + 1, tree)
    if (leftNodeToSplit) return leftNodeToSplit

    let rightNodeToSplit = canSplit(node.rhs, depth + 1, tree)
    if (rightNodeToSplit) return rightNodeToSplit
  }

  return false
}

export function reduce(tree) {
  let nodeToExplode = canExplode(tree)
  if (nodeToExplode) {
    explode(nodeToExplode, tree)
    return reduce(tree)
  }

  let nodeToSplit = canSplit(tree)
  if (nodeToSplit) {
    split(nodeToSplit)
    return reduce(tree)
  }

  return tree
}

export function parse(str) {
  return (function parse(json, parent = null) {
    if (typeof json === 'number') return { type: 'leaf', parent, value: json }

    let branch = { type: 'branch', parent, lhs: null, rhs: null }
    branch.lhs = parse(json[0], branch)
    branch.rhs = parse(json[1], branch)
    return branch
  })(JSON.parse(str))
}

export function debug(node, depth = 0) {
  if (node.type === 'leaf') return node.value
  return `[${debug(node.lhs, depth + 1)},${debug(node.rhs, depth + 1)}]`
}
