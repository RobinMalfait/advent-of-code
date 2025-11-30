import { DefaultMap } from 'aoc-utils'
import { compareAsc, differenceInMinutes } from 'date-fns'

export default function (blob: string) {
  let logs = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))
    .sort((a, z) => compareAsc(a.date, z.date))

  let totalSleepTime = new DefaultMap<number, number>(() => 0)
  let minuteTracker = new DefaultMap<number, DefaultMap<number, number>>(
    () => new DefaultMap(() => 0),
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
      totalSleepTime.set(state.guard, totalSleepTime.get(state.guard) + diff)
      for (let i of Array(diff).keys()) {
        let key = state.start.getMinutes() + i
        minuteTracker.get(state.guard).set(key, minuteTracker.get(state.guard).get(key) + 1)
      }
    }
  }

  let chosenGuardId = Array.from(totalSleepTime.keys())
    .sort((a, z) => totalSleepTime.get(a) - totalSleepTime.get(z))
    .pop()

  let chosenMinute = Array.from(minuteTracker.get(chosenGuardId).keys())
    .sort(
      (a, z) => minuteTracker.get(chosenGuardId).get(a) - minuteTracker.get(chosenGuardId).get(z),
    )
    .pop()

  return chosenGuardId * chosenMinute
}

function parse(input: string) {
  let { groups } = /\[(?<date>.*)\] (?<message>.*)/.exec(input)

  if (groups.message === 'falls asleep') {
    return {
      type: 'SLEEP',
      date: new Date(groups.date),
    }
  }
  if (groups.message === 'wakes up') {
    return {
      type: 'WAKE',
      date: new Date(groups.date),
    }
  }
  let {
    groups: { guardId },
  } = /Guard #(?<guardId>\d+) begins shift/.exec(groups.message)

  return {
    type: 'SHIFT',
    date: new Date(groups.date),
    id: Number(guardId),
  }
}
