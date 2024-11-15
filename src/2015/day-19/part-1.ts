export default function (blob: string) {
  let { replacements, molecule } = parse(blob)
  let molecules = new Set<string>()

  for (let [from, to] of replacements) {
    for (let i = 0; i < molecule.length; i++) {
      if (molecule.slice(i, i + from.length) === from) {
        molecules.add(molecule.slice(0, i) + to + molecule.slice(i + from.length))
      }
    }
  }

  return molecules.size
}

function parse(input: string) {
  let [replacements, molecule] = input.trim().split('\n\n')

  return {
    replacements: replacements.split('\n').map((line) => line.trim().split(' => ')),
    molecule: molecule.trim(),
  }
}
