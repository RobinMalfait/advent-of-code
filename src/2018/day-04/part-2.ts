import { compareAsc, differenceInMinutes } from 'date-fns'

export default function (blob: string) {
  let logs = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .sort((a, z) => compareAsc(a.date, z.date))

  let minuteTracker = new DefaultMap<number, DefaultMap<number, number>>(
    () => new DefaultMap(() => 0)
  )

  let state = {
    guard: null as null | number,
    start: null as null | Date,
  }

  for (let log of logs) {
    if (log.type === 'SHIFT') {
      state.guard = log.id
      state.start = null
    } else if (log.type === 'SLEEP') {
      state.start = log.date
    } else if (log.type === 'WAKE') {
      let end = log.date
      let diff = differenceInMinutes(end, state.start)
      for (let i of Array(diff).keys()) {
        let key = state.start.getMinutes() + i
        minuteTracker.get(state.guard).set(key, minuteTracker.get(state.guard).get(key) + 1)
      }
    }
  }

  let chosenGuardId = null as null | number
  let chosenMinute = null as null | number

  let maxCount = Number.NEGATIVE_INFINITY

  for (let [guard, minuteCount] of minuteTracker) {
    for (let [minute, count] of minuteCount) {
      if (count > maxCount) {
        chosenGuardId = guard
        chosenMinute = minute
        maxCount = count
      }
    }
  }

  return chosenGuardId * chosenMinute
}

function parse(input: string) {
  let { groups } = /\[(?<date>.*)\] (?<message>.*)/.exec(input)

  if (groups.message === 'falls asleep') {
    return {
      type: 'SLEEP',
      date: new Date(groups.date),
    }
  } else if (groups.message === 'wakes up') {
    return {
      type: 'WAKE',
      date: new Date(groups.date),
    }
  } else {
    let {
      groups: { guardId },
    } = /Guard #(?<guardId>\d+) begins shift/.exec(groups.message)

    return {
      type: 'SHIFT',
      date: new Date(groups.date),
      id: Number(guardId),
    }
  }
}

class DefaultMap<TKey = string, TValue = any> extends Map<TKey, TValue> {
  constructor(private factory: (key: TKey) => TValue) {
    super()
  }

  get(key: TKey) {
    if (!this.has(key)) {
      this.set(key, this.factory(key))
    }

    return super.get(key)
  }
}
