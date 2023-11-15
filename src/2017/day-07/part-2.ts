export default function (blob: string) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let parents = new Map<string, string>(instructions.map((instruction) => [instruction.name, null]))

  for (let instruction of instructions) {
    for (let dependency of instruction.dependencies) {
      parents.set(dependency, instruction.name)
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
