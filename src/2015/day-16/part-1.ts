let tape = `
  children: 3
  cats: 7
  samoyeds: 2
  pomeranians: 3
  akitas: 0
  vizslas: 0
  goldfish: 5
  trees: 3
  cars: 2
  perfumes: 1
`
export default function (blob: string) {
  let report = new Map(
    tape
      .trim()
      .split('\n')
      .map((line) => line.trim().split(': '))
      .map(([key, amount]) => [key, Number(amount)] as const)
      .filter(([, amount]) => amount !== null)
  )

  return blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .find(([, info]) => {
      for (let [property, value] of info) {
        if (report.get(property) !== value) {
          return false
        }
      }

      return true
    })
    ?.at(0)
}

function parse(input: string) {
  let [_, i] = /Sue (\d+):/.exec(input)
  let info = new Map(
    input
      .slice(_.length)
      .split(', ')
      .map((raw) => raw.split(': '))
      .map(([key, value]) => [key.trim(), Number(value.trim())] as const)
  )
  return [i, info] as const
}
