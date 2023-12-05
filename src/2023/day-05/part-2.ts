export default function (blob: string) {
  let { seeds, maps } = parse(blob.trim())

  let min = Infinity

  for (let [start, len] of chunk(seeds, 2)) {
    for (let seed = start; seed < start + len; seed++) {
      let a = locate(seed, maps.get('seed-to-soil'))
      let b = locate(a, maps.get('soil-to-fertilizer'))
      let c = locate(b, maps.get('fertilizer-to-water'))
      let d = locate(c, maps.get('water-to-light'))
      let e = locate(d, maps.get('light-to-temperature'))
      let f = locate(e, maps.get('temperature-to-humidity'))
      let g = locate(f, maps.get('humidity-to-location'))

      min = Math.min(min, g)
    }
  }

  return min
}

function chunk<T>(input: T[], size: number): T[][] {
  let output: T[][] = []
  for (let i = 0; i < input.length; i += size) {
    output.push(input.slice(i, i + size))
  }
  return output
}

function locate(input: number, ranges: [dst: number, src: number, len: number][]): number {
  for (let [dst, src, len] of ranges) {
    if (input >= src && input < src + len) {
      return dst + (input - src)
    }
  }
  return input
}

function parse(input: string) {
  let [seeds, ...maps] = input.split('\n\n')
  return {
    seeds: seeds.replace('seeds: ', '').split(/\s+/g).map(Number),
    maps: new Map(maps.map((map) => map.split('\n').map((line) => line.trim())).map(parseMap)),
  }
}

function parseMap(input: string[]) {
  let name = input.shift().replace(' map:', '')
  return [name, input.map((line) => line.split(/\s+/g).map(Number) as [dst: number, src: number, len: number])] as const
}
