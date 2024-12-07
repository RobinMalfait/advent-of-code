// Day 6: Universal Orbit Map

export default function calculateOrbits(input) {
  let direct_map = input.split('\n').reduce((combined, value) => {
    let [k, v] = value.split(')')
    combined[k] = combined[k] || []
    combined[v] = combined[v] || []

    combined[k].push(v)

    return combined
  }, {})

  let nodes = generateGraph(direct_map)

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
            `The generator with name "${node.name}" depends on "${id}" but it does not exist.`
          )
        }

        return dependency
      })
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
