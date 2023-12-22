import { DefaultMap } from 'aoc-utils'

export default function (blob: string, presses = 1000) {
  let modules = parse(blob)

  // Link outputs to inputs of conjunction
  for (let [name, module] of modules) {
    for (let output of module.output) {
      if (!modules.has(output)) {
        continue
      }

      let outputModule = modules.get(output)
      if (outputModule.type === 'conjunction') {
        // Getting a default object that doesn't exist will insert the default
        outputModule.input.get(name)
      }
    }
  }

  let count = { [Pulse.Low]: 0, [Pulse.High]: 0 }

  // The Button Press™
  for (let _ of Array(presses)) {
    let q: [tx: string, rx: string, Pulse][] = [['button', 'broadcaster', Pulse.Low]]

    while (q.length > 0) {
      let [tx, rx, pulse] = q.shift()

      count[pulse] += 1

      if (!modules.has(rx)) {
        continue
      }

      let rxModule = modules.get(rx)

      if (rxModule.type === 'flip-flop') {
        if (pulse === Pulse.Low) {
          rxModule.on = !rxModule.on
          for (let dst of rxModule.output) {
            q.push([rx, dst, rxModule.on ? Pulse.High : Pulse.Low])
          }
        }
      } else if (rxModule.type === 'conjunction') {
        rxModule.input.set(tx, pulse)
        let allHigh = Array.from(rxModule.input.values()).every((x) => x === Pulse.High)
        for (let dst of rxModule.output) {
          q.push([rx, dst, allHigh ? Pulse.Low : Pulse.High])
        }
      } else if (rxModule.type === 'broadcaster') {
        for (let dst of rxModule.output) {
          q.push([rx, dst, pulse])
        }
      }
    }
  }

  return count[Pulse.Low] * count[Pulse.High]
}

enum Pulse {
  Low,
  High,
}

function parse(input: string) {
  return new Map<
    string,
    | { type: 'broadcaster'; output: string[] }
    | {
        type: 'flip-flop'
        output: string[]
        on: boolean
      }
    | {
        type: 'conjunction'
        input: DefaultMap<string, Pulse>
        output: string[]
      }
  >(
    input
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .map((input) => input.split(' -> ').map((s) => s.trim()))
      .map(([module, other]) => {
        let output = other
          .trim()
          .split(',')
          .map((s) => s.trim())
        if (module === 'broadcaster') {
          return ['broadcaster', { type: 'broadcaster', output }] as const
        } else if (module.startsWith('%')) {
          return [module.slice(1), { type: 'flip-flop', output, on: false }] as const
        } else if (module.startsWith('&')) {
          return [
            module.slice(1),
            { type: 'conjunction', input: new DefaultMap<string, Pulse>(() => Pulse.Low), output },
          ] as const
        }
      })
  )
}
