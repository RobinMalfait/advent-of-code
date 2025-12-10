import { DefaultMap, queue } from 'aoc-utils'

export default function (blob: string) {
  let machines = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let total = 0
  for (let { target, buttons } of machines) {
    let q = queue([0])
    let pushes = new DefaultMap((_state: number) => 0)

    for (let current of q) {
      if (current === target) {
        total += pushes.get(current)
        break
      }

      for (let button of buttons) {
        let next = current ^ button // Press the button
        if (pushes.has(next)) continue // Already visited

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
  let indicator = schematics.shift()
  let _joltage = schematics.pop() // Unused in Part 1

  indicator = indicator.slice(1, -1) // Drop brackets
  let digits = indicator.length

  // Convert indicators to target number (bitmask)
  let target = 0
  for (let i = 0; i <= digits; i++) {
    if (indicator[i] === '#') {
      target += 1 << (digits - 1 - i)
    }
  }

  // Convert schematics to button numbers (bitmasks)
  let buttons = schematics.map((scheme) => {
    let button = 0
    for (let pos of scheme.slice(1, -1).split(',').map(Number)) {
      button += 1 << (digits - 1 - pos)
    }
    return button
  })

  return {
    target,
    buttons,
    _joltage,
  }
}
