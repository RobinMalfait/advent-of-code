import { DefaultMap, priorityQueue } from 'aoc-utils'

export default function (blob: string) {
  let machines = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let total = 0
  for (let { joltage, buttons } of machines) {
    let empty = Joltage.empty(joltage.levels.length)
    let q = priorityQueue<Joltage>((joltage) => joltage.distance(empty))
    q.push(joltage)
    let pushes = new DefaultMap((_state: Joltage) => 0)

    for (let current of q) {
      if (current === empty) {
        total += pushes.get(current)
        break
      }

      for (let button of buttons) {
        let next = current.sub(button)
        if (pushes.has(next) || !next.isValid()) {
          continue
        }

        // It took us `n` pushes to get to `current`, so it takes `n + 1` to get
        // to the `next` state.
        pushes.set(next, pushes.get(current) + 1)
        q.push(next)
      }
    }
  }

  return total
}

function parse(input: string) {
  let schematics = input.split(' ')
  let _indicator = schematics.shift() // Unused in Part 2
  let joltage = schematics.pop().slice(1, -1) // Drop curlies
  let joltages = joltage.split(',').map(Number)

  let digits = joltages.length

  // Convert schematics to buttons
  let buttons = schematics.map((scheme) => {
    let activations = Array.from({ length: digits }, () => 0)
    for (let pos of scheme.slice(1, -1).split(',').map(Number)) {
      activations[pos] = 1
    }
    return Joltage.from(activations)
  })

  return {
    _indicator,
    buttons,
    joltage: Joltage.from(joltages),
  }
}

class Joltage {
  static #joltages = new DefaultMap((key: string) => {
    return new Joltage(key.split(',').map(Number))
  })

  private constructor(public levels: number[]) {}

  static from(levels: number[]) {
    return Joltage.#joltages.get(levels.join(','))
  }

  static empty(size: number) {
    return Joltage.from(Array.from({ length: size }, () => 0))
  }

  sub(other: Joltage) {
    if (this.levels.length !== other.levels.length) {
      throw new Error('Cannot subtract joltages of different lengths')
    }

    return Joltage.from(this.levels.map((level, i) => level - other.levels[i]))
  }

  distance(other: Joltage) {
    if (this.levels.length !== other.levels.length) {
      throw new Error('Cannot compute distance between joltages of different lengths')
    }

    return this.levels.reduce((sum, level, i) => sum + Math.abs(level - other.levels[i]), 0)
  }

  isValid() {
    return this.levels.every((level) => level >= 0)
  }
}
