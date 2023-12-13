import { chunk } from 'aoc-utils'

export default function (blob: string) {
  let { seeds, maps } = parse(blob.trim())

  let min = Infinity

  for (let [start, len] of chunk(seeds, 2)) {
    let q: [start: number, end: number][] = [
      // Initial seed range
      [start, start + len],
    ]

    let a = locateRange(q, maps.get('seed-to-soil'))
    let b = locateRange(a, maps.get('soil-to-fertilizer'))
    let c = locateRange(b, maps.get('fertilizer-to-water'))
    let d = locateRange(c, maps.get('water-to-light'))
    let e = locateRange(d, maps.get('light-to-temperature'))
    let f = locateRange(e, maps.get('temperature-to-humidity'))
    let g = locateRange(f, maps.get('humidity-to-location'))

    for (let [start] of g) {
      min = Math.min(min, start)
    }
  }

  return min
}

function locateRange(
  seedRanges: [start: number, end: number][],
  mapRanges: [dst: number, src: number, len: number][]
) {
  let done = []

  for (let [dst, src, len] of mapRanges) {
    let rangeStart = src
    let rangeEnd = src + len

    for (let [seedStart, seedEnd] of seedRanges.splice(0)) {
      // Comparison chart:
      // 0.          ├──────────────────────────┤              Range we are comparing with (rangeStart, rangeEnd)
      //             ┊                          ┊
      // 1. ├──────┤ ┊                          ┊              Completely before
      //             ┊                          ┊
      // 2.          ┊                          ┊ ├───────┤    Completely after
      //             ┊                          ┊
      // 3.        ├──────────────────────────────┤            Completely overlapping
      //             ┊                          ┊
      // 4.    ├───────────┤                    ┊              Overlapping start
      //             ┊                          ┊
      // 5.          ┊                    ├───────────┤        Overlapping end
      //             ┊                          ┊
      // 6.          ┊      ├────────────┤      ┊              Completely inside

      // 🎶 Cut my ranges into pieces, this is my last resort. Suffication computing.

      // 0.          ├──────────────────────────┤
      // 1. ├──────┤ ┊                          ┊
      if (seedEnd < rangeStart) {
        seedRanges.push([seedStart, Math.min(seedEnd, rangeStart)])
      }

      // 0.          ├──────────────────────────┤
      // 2.          ┊                          ┊ ├───────┤
      else if (seedStart > rangeEnd) {
        seedRanges.push([Math.max(rangeEnd, seedStart), seedEnd])
      }

      // 0.          ├──────────────────────────┤
      // 3.        ├──────────────────────────────┤
      else if (seedStart <= rangeStart && seedEnd >= rangeEnd) {
        // Before part
        seedRanges.push([seedStart, rangeStart])

        // Middle part
        done.push([dst, dst + (rangeEnd - rangeStart)])

        // After part
        seedRanges.push([rangeEnd, seedEnd])
      }

      // 0.          ├──────────────────────────┤
      // 4.    ├───────────┤                    ┊
      else if (seedStart < rangeStart && seedEnd > rangeStart) {
        // Before part
        seedRanges.push([seedStart, rangeStart])

        // Middle part
        done.push([dst, dst + (seedEnd - rangeStart)])
      }

      // 0.          ├──────────────────────────┤
      // 5.          ┊                    ├───────────┤
      else if (seedStart < rangeEnd && seedEnd > rangeEnd) {
        // Middle part
        done.push([dst + (seedStart - rangeStart), dst + (rangeEnd - rangeStart)])

        // After part
        seedRanges.push([rangeEnd, seedEnd])
      }

      // 0.          ├──────────────────────────┤
      // 6.          ┊      ├────────────┤      ┊
      else if (seedStart >= rangeStart && seedEnd <= rangeEnd) {
        done.push([dst + (seedStart - rangeStart), dst + (seedEnd - rangeStart)])
      }
    }
  }

  return done.concat(seedRanges)
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
  return [
    name,
    input.map((line) => line.split(/\s+/g).map(Number) as [dst: number, src: number, len: number]),
  ] as const
}
