export default function (blob: string, rounds: number = 20, stress_reducer: number = 3) {
  let monkeys = blob.trim().split('\n\n').map(parseMonkey)
  let activity_monitor = Array(monkeys.length).fill(0)
  let common = monkeys.reduce((total, current) => total * current.divisible_by, 1)

  for (let current_monkey of Array(rounds * monkeys.length).keys()) {
    current_monkey %= monkeys.length

    let monkey = monkeys[current_monkey]
    activity_monitor[current_monkey] += monkey.items.length

    while (monkey.items.length) {
      let item = monkey.items.shift()

      let new_worry_level = monkey.operation(item)
      new_worry_level /= stress_reducer
      new_worry_level = Math.floor(new_worry_level)
      if (stress_reducer <= 1) {
        new_worry_level %= common
      }

      if (new_worry_level % monkey.divisible_by === 0) {
        monkeys[monkey.goto_true].items.push(new_worry_level)
      } else {
        monkeys[monkey.goto_false].items.push(new_worry_level)
      }
    }
  }

  let [a, b] = activity_monitor.sort((a, z) => z - a)
  return a * b
}

interface Monkey {
  id: number
  items: number[]
  operation: (old: number) => number
  divisible_by: number
  goto_true: number
  goto_false: number
}

function parseMonkey(block: string): Monkey {
  let lines = block.split('\n').map((line) => line.trim())
  return {
    id: Number(lines[0].replace('Monkey ', '').replace(':', '')),
    items: lines[1].replace('Starting items: ', '').split(', ').map(Number),
    operation: (function () {
      let [lhs, op, rhs] = lines[2].replace('Operation: new = ', '').split(' ')
      if (lhs === 'old' && op === '+' && rhs === 'old') {
        return (old: number) => old + old
      } else if (lhs === 'old' && op === '*' && rhs === 'old') {
        return (old: number) => old * old
      } else if (lhs === 'old' && op === '+') {
        return (old: number) => old + Number(rhs)
      } else if (lhs === 'old' && op === '*') {
        return (old: number) => old * Number(rhs)
      }
    })(),
    divisible_by: Number(lines[3].replace('Test: divisible by ', '')),
    goto_true: Number(lines[4].replace('If true: throw to monkey ', '')),
    goto_false: Number(lines[5].replace('If false: throw to monkey ', '')),
  }
}
