export default function (blob: string, workers = 5, minduration = 60) {
  let instructions = blob
    .trim()
    .split('\n')
    .map((line) => parse(line.trim()))

  let tree = new DefaultMap(() => new Set<string>())

  for (let [first, second] of instructions) {
    tree.get(first)
    tree.get(second).add(first)
  }

  let clock = 0
  let working = new Set()
  let done = new Set()

  function next() {
    return (
      Array.from(tree.keys())
        .filter((x) => Array.from(tree.get(x)).every((x) => done.has(x))) // All dependencies should be done
        .filter((x) => !working.has(x)) // Shouldn't be working on this step
        .sort((a, z) => tree.get(a).size - tree.get(z).size || a.localeCompare(z)) // Sort by minimal dependencies or alphabetically
        .at(0) ?? null
    )
  }

  let jobs: { step: string; remaining: number }[] = []
  while (tree.size || jobs.length) {
    // Schedule as many jobs as possible
    while (jobs.length < workers) {
      let step = next()
      if (step === null) {
        break
      }

      working.add(step)

      let duration = minduration + (step.charCodeAt(0) - 64)
      jobs.push({ step, remaining: duration })
    }

    clock += 1

    for (let job of jobs.slice()) {
      if (--job.remaining <= 0) {
        done.add(job.step)
        working.delete(job.step)
        tree.delete(job.step)

        jobs.splice(jobs.indexOf(job), 1)
      }
    }
  }

  return clock
}

function parse(input: string) {
  let { first, second } = /Step (?<first>\w) must be finished before step (?<second>\w) can begin./.exec(input).groups
  return [first, second] as const
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
