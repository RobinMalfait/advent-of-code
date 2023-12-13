// Day 6: Universal Orbit Map

module.exports = function calculateOrbits(input) {
  const direct_map = input.split('\n').reduce((combined, value) => {
    const [k, v] = value.split(')')
    combined[k] = combined[k] || []
    combined[v] = combined[v] || []

    combined[k].push(v)

    return combined
  }, {})

  const nodes = generateGraph(direct_map)

  return Object.values(calculateTransitiveDependencies(nodes)).reduce(
    (total, deps) => total + deps.length,
    0
  )
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
