export default function (blob: string, rounds: number = 20, stress_reducer: number = 3) {
  let monkeys = new Map<number, Monkey>(blob.trim().split('\n\n').map(parseMonkey))
  let activity_monitor = [...Array(monkeys.size).keys()].fill(0)
  let common = Array.from(monkeys.values()).reduce((common, current) => lcm(common, current.divisible_by), 1)

  let current_monkey = 0

  for (let _ of Array(rounds * monkeys.size)) {
    let monkey = monkeys.get(current_monkey)
    activity_monitor[current_monkey] += monkey.items.length

    while (monkey.items.length) {
      let item = monkey.items.shift()

      let new_worry_level = monkey.operation(item)
      new_worry_level /= stress_reducer
      new_worry_level = Math.floor(new_worry_level)
      new_worry_level %= common

      if (new_worry_level % monkey.divisible_by === 0) {
        monkeys.get(monkey.goto_true).items.push(new_worry_level)
      } else {
        monkeys.get(monkey.goto_false).items.push(new_worry_level)
      }
    }

    current_monkey = (current_monkey + 1) % monkeys.size
  }

  let [a, b] = activity_monitor.sort((a, z) => z - a)
  return a * b
}

interface Monkey {
  items: number[]
  operation: (old: number) => number
  divisible_by: number
  goto_true: number
  goto_false: number
}

function parseMonkey(block: string): [number, Monkey] {
  let lines = block.split('\n').map((line) => line.trim())
  return [
    Number(lines[0].replace('Monkey ', '').replace(':', '')),
    {
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
    },
  ]
}

function lcm(x: number, y: number): number {
  return (x * y) / gcd(x, y)
}

function gcd(x: number, y: number): number {
  let max = x
  let min = y
  if (min > max) {
    ;[min, max] = [max, min]
  }

  while (true) {
    let res = max % min
    if (res == 0) return min

    max = min
    min = res
  }
}
