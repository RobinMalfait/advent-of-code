import { DefaultMap } from 'aoc-utils'

export default function (blob: string) {
  let instructions = blob
    .trim()
    .split('\n')
    .flatMap((line) => Array.from(parse(line.trim())))
    .sort((a, z) => a.type.localeCompare(z.type))

  let bots = new DefaultMap<number, number[]>(() => [])
  let connections = new DefaultMap<
    number,
    { low: ['output' | 'bot', number] | null; high: ['output' | 'bot', number] | null }
  >(() => ({
    low: null,
    high: null,
  }))

  // Setup
  for (let instruction of instructions) {
    if (instruction.type === 'assign') {
      bots.get(instruction.to).push(instruction.value)
    } else if (instruction.type === 'give-low') {
      connections.get(instruction.from).low = [instruction.toType, instruction.toId]
    } else if (instruction.type === 'give-high') {
      connections.get(instruction.from).high = [instruction.toType, instruction.toId]
    }
  }

  // Simulate
  while (true) {
    for (let [bot, values] of bots) {
      if (values.length !== 2) {
        continue
      }

      let [low, high] = values.splice(0, 2).sort((a, z) => a - z)

      if (low === 17 && high === 61) {
        return bot
      }

      let [lowType, lowTarget] = connections.get(bot).low
      if (lowType === 'bot') {
        bots.get(lowTarget).push(low)
      }

      let [highType, highTarget] = connections.get(bot).high
      if (highType === 'bot') {
        bots.get(highTarget).push(high)
      }
    }
  }
}

function* parse(
  input: string
): Generator<
  | { type: 'assign'; value: number; to: number }
  | { type: 'give-low'; from: number; toType: 'output' | 'bot'; toId: number }
  | { type: 'give-high'; from: number; toType: 'output' | 'bot'; toId: number }
> {
  for (let { groups } of input.matchAll(/value (?<value>\d+) goes to bot (?<bot>\d+)/g)) {
    yield { type: 'assign', value: Number(groups.value), to: Number(groups.bot) }
    return
  }

  for (let { groups } of input.matchAll(
    /bot (?<from>\d+) gives low to (?<lowType>output|bot) (?<lowId>\d+) and high to (?<highType>output|bot) (?<highId>\d+)/g
  )) {
    yield {
      type: 'give-low',
      from: Number(groups.from),
      toType: groups.lowType as 'output' | 'bot',
      toId: Number(groups.lowId),
    }
    yield {
      type: 'give-high',
      from: Number(groups.from),
      toType: groups.highType as 'output' | 'bot',
      toId: Number(groups.highId),
    }
    return
  }

  console.log('TODO:', input)
  throw new Error('Not yet implemented.')
}
