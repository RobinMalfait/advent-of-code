// Day 14: Space Stoichiometry

import { sum } from '../utils'

const CHEMICALS = {
  ORE: 'ORE',
  FUEL: 'FUEL',
}

export default function fuelproducer(input, fuel) {
  let reactions = parseReactions(input)

  // So that we can control the amount of fuel...
  reactions.MAGIC_START = {
    amount: 1,
    requires: {
      [CHEMICALS.FUEL]: fuel || reactions[CHEMICALS.FUEL].amount,
    },
  }

  let definition = Object.entries(reactions).reduce(
    (obj, [chemical, { requires }]) => {
      obj[chemical] = Object.keys(requires || {})
      return obj
    },
    {
      // ORE is the only resource we actually have that doesn't require other
      // resources.
      [CHEMICALS.ORE]: [],
    },
  )
  let graph = generateGraph(definition)
  let order = Object.keys(
    Object.fromEntries(
      Object.entries(calculateTransitiveDependencies(graph)).sort(([, a], [, b]) =>
        Math.sign(b.length - a.length),
      ),
    ),
  )

  let counts = order.reduce((map, chemical) => {
    if (!map.has(chemical)) {
      map.set(chemical, 1)
    }

    if (chemical === CHEMICALS.ORE) {
      return map
    }

    let { amount, requires } = reactions[chemical]
    let factor = Math.ceil(map.get(chemical) / amount)

    for (let [dep_chemical, dep_amount] of Object.entries(requires)) {
      let additional = factor * dep_amount
      let existing = map.has(dep_chemical) ? map.get(dep_chemical) : 0
      map.set(dep_chemical, existing + additional)
    }

    return map
  }, new Map())

  let only_require_ore = Object.entries(reactions).filter(
    ([, { requires }]) => requires[CHEMICALS.ORE] !== undefined,
  )

  // console.log("counts:", counts);
  return sum(
    only_require_ore.map(([chemical, { amount, requires }]) => {
      let amounts_of_ore = requires[CHEMICALS.ORE]
      return amounts_of_ore * Math.ceil(counts.get(chemical) / amount)
    }),
  )
}

function parseReactions(input) {
  return Object.assign(
    {},
    ...input.split('\n').map((reaction) => {
      let [required_chemicals, produced_chemical] = reaction.split(' => ')

      let [chemical, amount] = parseChemical(produced_chemical)

      return {
        [chemical]: {
          amount,
          requires: Object.fromEntries(required_chemicals.split(', ').map(parseChemical)),
        },
      }
    }),
  )
}

function parseChemical(input) {
  let [amount, chemical] = input.split(' ')
  return [chemical, Number(amount)]
}

class Node {
  constructor(id, direct_dependency_ids) {
    this.id = id
    this.direct_dependency_ids = direct_dependency_ids
    this.children = []
  }

  addChildren(children) {
    this.children.push(...children)
  }

  getTransitiveDependencyNames(include_own_name = false, seen = []) {
    if (seen.includes(this)) {
      throw new Error(
        `You have a circular dependency! ${seen
          .concat(this)
          .map((s) => `"${s.name}"`)
          .join(' -> ')}`,
      )
    }

    let dependencies = []

    for (let child of this.children) {
      for (let dependency of child.getTransitiveDependencyNames(true, [...seen, this])) {
        dependencies.push(dependency)
      }
    }

    if (include_own_name) {
      dependencies.push(this.id)
    }

    return [...new Set(dependencies)]
  }
}

function generateGraph(definition = {}) {
  // Create nodes for each item in the definition list
  let nodes = Object.keys(definition).reduce((result, identifier) => {
    result[identifier] = new Node(identifier, definition[identifier])
    return result
  }, {})

  // Attach each required dependency as an actual child by reference
  for (let node of Object.values(nodes)) {
    node.addChildren(
      node.direct_dependency_ids.map((id) => {
        let dependency = nodes[id]

        if (dependency === undefined) {
          throw new Error(
            `The generator with name "${node.name}" depends on "${id}" but it does not exist.`,
          )
        }

        return dependency
      }),
    )
  }

  return nodes
}

function calculateTransitiveDependencies(nodes) {
  return Object.keys(nodes).reduce((result, id) => {
    result[id] = nodes[id].getTransitiveDependencyNames()
    return result
  }, {})
}
