// Day 14: Space Stoichiometry

const { sum } = require('../utils')

const CHEMICALS = {
  ORE: 'ORE',
  FUEL: 'FUEL',
}

module.exports = function fuelproducer(input, fuel) {
  const reactions = parseReactions(input)

  // So that we can control the amount of fuel...
  reactions.MAGIC_START = {
    amount: 1,
    requires: {
      [CHEMICALS.FUEL]: fuel || reactions[CHEMICALS.FUEL].amount,
    },
  }

  const definition = Object.entries(reactions).reduce(
    (obj, [chemical, { requires }]) => ({
      ...obj,
      [chemical]: Object.keys(requires || {}),
    }),
    {
      // ORE is the only resource we actually have that doesn't require other
      // resources.
      [CHEMICALS.ORE]: [],
    }
  )
  const graph = generateGraph(definition)
  const order = Object.keys(
    Object.fromEntries(
      Object.entries(calculateTransitiveDependencies(graph)).sort(([, a], [, b]) =>
        Math.sign(b.length - a.length)
      )
    )
  )

  const counts = order.reduce((map, chemical, index) => {
    if (!map.has(chemical)) {
      map.set(chemical, 1)
    }

    if (chemical === CHEMICALS.ORE) {
      return map
    }

    const { amount, requires } = reactions[chemical]
    const factor = Math.ceil(map.get(chemical) / amount)

    for (const [dep_chemical, dep_amount] of Object.entries(requires)) {
      const additional = factor * dep_amount
      const existing = map.has(dep_chemical) ? map.get(dep_chemical) : 0
      map.set(dep_chemical, existing + additional)
    }

    return map
  }, new Map())

  const only_require_ore = Object.entries(reactions).filter(
    ([, { requires }]) => requires[CHEMICALS.ORE] !== undefined
  )

  // console.log("counts:", counts);
  return sum(
    only_require_ore.map(([chemical, { amount, requires }]) => {
      const amounts_of_ore = requires[CHEMICALS.ORE]
      return amounts_of_ore * Math.ceil(counts.get(chemical) / amount)
    })
  )
}

function parseReactions(input) {
  return Object.assign(
    {},
    ...input.split('\n').map((reaction) => {
      const [required_chemicals, produced_chemical] = reaction.split(' => ')

      const [chemical, amount] = parseChemical(produced_chemical)

      return {
        [chemical]: {
          amount,
          requires: Object.fromEntries(required_chemicals.split(', ').map(parseChemical)),
        },
      }
    })
  )
}

function parseChemical(input) {
  const [amount, chemical] = input.split(' ')
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
          .join(' -> ')}`
      )
    }

    const dependencies = []

    this.children.forEach((child) => {
      child.getTransitiveDependencyNames(true, [...seen, this]).forEach((dependency) => {
        dependencies.push(dependency)
      })
    })

    if (include_own_name) {
      dependencies.push(this.id)
    }

    return [...new Set(dependencies)]
  }
}

function generateGraph(definition = {}) {
  // Create nodes for each item in the definition list
  const nodes = Object.keys(definition).reduce((result, identifier) => {
    result[identifier] = new Node(identifier, definition[identifier])
    return result
  }, {})

  // Attach each required dependency as an actual child by reference
  Object.values(nodes).forEach((node) => {
    node.addChildren(
      node.direct_dependency_ids.map((id) => {
        const dependency = nodes[id]

        if (dependency === undefined) {
          throw new Error(
            `The generator with name "${node.name}" depends on "${id}" but it does not exist.`
          )
        }

        return dependency
      })
    )
  })

  return nodes
}

function calculateTransitiveDependencies(nodes) {
  return Object.keys(nodes).reduce((result, id) => {
    result[id] = nodes[id].getTransitiveDependencyNames()
    return result
  }, {})
}
