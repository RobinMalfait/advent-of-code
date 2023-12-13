const fs = require('fs')
const { resolve } = require('path')
const Table = require('cli-table')

module.exports.read = async function read(base, path) {
  return fs.promises.readFile(resolve(base, path), 'utf8')
}

module.exports.match = function match(value, patterns, ...args) {
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

module.exports.abort = function abort() {
  throw new AbortError()
}

module.exports.aborted = function aborted(err) {
  return err instanceof AbortError
}

module.exports.range = function range(n, offset = 0) {
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

module.exports.intersect = function intersect(...args) {
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

module.exports.manhatten = function manhatten([x0, y0], [x1, y1]) {
  return Math.abs(x1 - x0) + Math.abs(y1 - y0)
}

module.exports.distance = function distance([x0, y0], [x1, y1]) {
  return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2))
}

module.exports.permutations = function permutations(input) {
  if (input.length === 0) {
    return [[]]
  }

  return input.reduce(
    (rows, value, i) => [
      ...rows,
      ...module.exports
        .permutations([...input.slice(0, i), ...input.slice(i + 1)])
        .map((x) => [value, ...x]),
    ],
    []
  )
}

module.exports.chunk = function chunk(array, n) {
  return module.exports.range(Math.ceil(array.length / n)).map((x, i) => {
    return array.slice(i * n, i * n + n)
  })
}

module.exports.perfLogs = function withPerfLogs(cb, message) {
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
  } else if (Array.isArray(input) && !Array.isArray(input[0])) {
    return [input]
  } else if (!Array.isArray(input)) {
    return [[input]]
  }
}

module.exports.compactTable = function compactTable(input, options = {}) {
  return module.exports.table(input, {
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

module.exports.table = function table(input, options = {}) {
  input = ensureTwoDimensional(input)
  const table = new Table(options)
  table.push(...input)
  return table.toString()
}

module.exports.lcm = function lcm(x, y) {
  return !x || !y ? 0 : Math.abs((x * y) / module.exports.gcd(x, y))
}

module.exports.gcd = function gcd(x, y) {
  return !y ? x : module.exports.gcd(y, x % y)
}

module.exports.sum = function sum(values) {
  return values.reduce((total, current) => total + current, 0)
}

module.exports.binarySearch = function binarySearch(cb, target = 0) {
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

module.exports.asyncBinarySearch = async function binarySearch(cb, target = 0) {
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
