export default function (blob: string) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let tree = new DefaultMap(() => new Set<string>())

  for (let [first, second] of instructions) {
    tree.get(first)
    tree.get(second).add(first)
  }

  function sort() {
    return Array.from(tree.keys()).sort((a, z) => {
      return tree.get(a).size - tree.get(z).size || a.localeCompare(z)
    })
  }

  let steps = []
  while (tree.size) {
    let next = sort().shift()

    steps.push(next)
    tree.delete(next)

    for (let dependencies of tree.values()) {
      dependencies.delete(next)
    }
  }

  return steps.join('')
}

function parse(input: string) {
  let { first, second } = /Step (?<first>\w) must be finished before step (?<second>\w) can begin./.exec(input).groups
  return [first, second] as const
}

class DefaultMap<TKey = string, TValue = any> extends Map<TKey, TValue> {
  constructor(private factory: (key: TKey) => TValue) {
    super()
  }

  get(key: TKey) {
    if (!this.has(key)) {
      this.set(key, this.factory(key))
    }

    return super.get(key)
  }
}
