import { sum } from 'aoc-utils'
import { init } from 'z3-solver'

export default async function (blob: string) {
  let { Context } = await init()
  let machines = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  return sum(
    await Promise.all(
      machines.map(async ({ joltage, buttons }) => {
        let ctx = Context('main')
        let solver = new ctx.Optimize()

        let m = buttons.length
        let n = joltage.length

        // Integer variables: number of presses per button
        let x = buttons.map((_, i) => ctx.Int.const(`x_${i}`))

        // x_i >= 0
        for (let i = 0; i < m; i++) {
          solver.add(x[i].ge(0))
        }

        // Target constraints: sum_i A[i][j] * x_i == target[j]
        for (let j = 0; j < n; j++) {
          let sum = ctx.Int.val(0)
          for (let i = 0; i < m; i++) {
            if (buttons[i][j] !== 0) {
              // @ts-expect-error Switching from Int to Aright. Shush TS
              sum = sum.add(x[i].mul(buttons[i][j]))
            }
          }
          solver.add(sum.eq(ctx.Int.val(joltage[j])))
        }

        // Minimize total presses
        let totalPresses = x.reduce((acc, xi) => acc.add(xi), ctx.Int.val(0))
        solver.minimize(totalPresses)

        // Solve
        let result = await solver.check()
        if (result !== 'sat') return 0

        let model = solver.model()
        return Number(model.eval(totalPresses).toString())
      }),
    ),
  )
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
    return activations
  })

  return {
    _indicator,
    buttons,
    joltage: joltages,
  }
}
