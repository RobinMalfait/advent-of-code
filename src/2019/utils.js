import fs from 'node:fs'
import { resolve } from 'node:path'
import Table from 'cli-table'

export async function read(base, path) {
  return fs.promises.readFile(resolve(base, path), 'utf8')
}

export function match(value, patterns, ...args) {
  try {
    return patterns[value](...args)
  } catch (err) {
    const available_keys = Object.keys(patterns)
    if (!available_keys.includes(value.toString())) {
      throw new Error(
        `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${available_keys
          .map((key) => `"${key}"`)
          .join(', ')}.`
      )
    }

    throw err
  }
}

class AbortError extends Error {}

export function abort() {
  throw new AbortError()
}

export function aborted(err) {
  return err instanceof AbortError
}

export function range(n, offset = 0) {
  return Array.from({ length: n }, (v, k) => k + offset)
}

function intersectBetween(a, b) {
  const [left, right] = [a, b].sort((a, b) => Math.sign(a.length - b.length))

  const can_use_hash_hack = ['string', 'number'].includes(typeof right[0])
  const right_hash = can_use_hash_hack
    ? right.reduce((acc, current) => Object.assign(acc, { [current]: true }), {})
    : right

  return left.filter(
    can_use_hash_hack
      ? (element) => right_hash[element] !== undefined
      : (element) => right.includes(element)
  )
}

export function intersect(...args) {
  if (args.length <= 0) {
    return []
  }

  if (args.length === 1) {
    return args[0]
  }

  if (args.length === 2) {
    return intersectBetween(args[0], args[1])
  }

  return args.reduce((a, b) => intersectBetween(a, b))
}

export function manhatten([x0, y0], [x1, y1]) {
  return Math.abs(x1 - x0) + Math.abs(y1 - y0)
}

export function distance([x0, y0], [x1, y1]) {
  return Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2)
}

export function permutations(input) {
  if (input.length === 0) {
    return [[]]
  }

  return input.reduce(
    (rows, value, i) =>
      rows.concat(
        permutations([...input.slice(0, i), ...input.slice(i + 1)]).map((x) => [value, ...x])
      ),
    []
  )
}

export function chunk(array, n) {
  return range(Math.ceil(array.length / n)).map((x, i) => {
    return array.slice(i * n, i * n + n)
  })
}

export function perfLogs(cb, message) {
  const start = Date.now()
  console.log({}, `[PERF]: [ START]: ${message}`)

  try {
    const result = cb()

    const end = Date.now()
    console.log({ duration: `${end - start}ms` }, `[PERF]: [FINISH]: ${message}`)
    return result
  } catch (err) {
    const end = Date.now()
    console.log({ duration: `${end - start}ms` }, `[PERF]: [FINISH]: ${message} (with error)`)

    throw err
  }
}

function ensureTwoDimensional(input) {
  if (Array.isArray(input) && Array.isArray(input[0])) {
    return input
  }
  if (Array.isArray(input) && !Array.isArray(input[0])) {
    return [input]
  }
  if (!Array.isArray(input)) {
    return [[input]]
  }
}

export function compactTable(input, options = {}) {
  return table(input, {
    chars: {
      mid: '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': '',
      'top-mid': '─',
      'bottom-mid': '─',
      middle: ' ',
    },
    ...options,
  })
}

export function table(input, options = {}) {
  input = ensureTwoDimensional(input)
  const table = new Table(options)
  table.push(...input)
  return table.toString()
}

export function lcm(x, y) {
  return !x || !y ? 0 : Math.abs((x * y) / gcd(x, y))
}

export function gcd(x, y) {
  return !y ? x : gcd(y, x % y)
}

export function sum(values) {
  return values.reduce((total, current) => total + current, 0)
}

export function binarySearch(cb, target = 0) {
  let lower_bound = 0
  let higher_bound = target
  while (lower_bound < higher_bound) {
    const middle = Math.floor((lower_bound + higher_bound + 1) / 2)
    if (cb(middle) <= target) {
      lower_bound = middle
    } else {
      higher_bound = middle - 1
    }
  }
  return lower_bound
}

export async function asyncBinarySearch(cb, target = 0) {
  let lower_bound = 0
  let higher_bound = target
  while (lower_bound < higher_bound) {
    const middle = Math.floor((lower_bound + higher_bound + 1) / 2)
    if ((await cb(middle)) <= target) {
      lower_bound = middle
    } else {
      higher_bound = middle - 1
    }
  }
  return lower_bound
}
