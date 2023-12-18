// Math
export function lcm(x: number, y: number) {
  return x === 0 || y === 0 ? 0 : Math.abs((x * y) / gcd(x, y))
}

export function gcd(x: number, y: number) {
  return y === 0 ? x : gcd(y, x % y)
}

export function degrees(radians: number) {
  return radians * (180 / Math.PI)
}

export function radians(degrees: number) {
  return degrees * (Math.PI / 180)
}

export function choose(n: number, k: number) {
  if (k > n) return 0

  return factorial(n) / (factorial(k) * factorial(n - k))
}

let factorialCache = new Map<number, number>([
  [0, 1],
  [1, 1],
])

export function factorial(n: number): number {
  if (factorialCache.has(n)) return factorialCache.get(n) as number
  let result = n * factorial(n - 1)
  factorialCache.set(n, result)
  return result
}

export function sum(numbers: number[]) {
  if (numbers.length <= 0) return 0
  if (numbers.length === 1) return numbers[0]

  let total = 0
  for (let number of numbers) total += number
  return total
}

export function product(numbers: number[]) {
  if (numbers.length <= 0) return 0
  if (numbers.length === 1) return numbers[0]

  let total = 1
  for (let number of numbers) total *= number
  return total
}

// Array / collection
export function* windows<T>(input: Iterable<T>, size: number) {
  // Array optimization
  if (Array.isArray(input)) {
    for (let i = 0; i < input.length - size + 1; i++) {
      yield input.slice(i, i + size)
    }

    return
  }

  // Iterator implementation
  let window: T[] = []

  for (let x of input) {
    window.push(x)

    if (window.length === size) {
      yield window
      window = window.slice(1)
    }
  }
}

export function zip<T>(...input: T[][]) {
  return input[0].map((_, i) => input.map((array) => array[i]))
}

export function transpose<T>(input: T[][]) {
  return input[0].map((_, i) => input.map((array) => array[i]))
}

export function chunk<T>(input: T[], size: number): T[][] {
  let output: T[][] = []
  for (let i = 0; i < input.length; i += size) {
    output.push(input.slice(i, i + size))
  }
  return output
}

export function* pairs<T>(input: T[]) {
  for (let a = 0; a < input.length; ++a) {
    for (let b = a + 1; b < input.length; ++b) {
      yield [input[a], input[b]] as const
    }
  }
}

export function* range(start: number, end: number, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i
  }
}

// Set
export function intersection<T>(a: T[], b: T[]) {
  return new Set(a.filter((x) => b.includes(x)))
}

// Flow control
export function match<T extends string | number = string, R = unknown>(
  value: T,
  lookup: Record<T, R | ((...args: any[]) => R)>,
  ...args: any[]
): R {
  if (value in lookup) {
    let returnValue = lookup[value]
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue
  }

  let error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`
  )
  if (Error.captureStackTrace) Error.captureStackTrace(error, match)
  throw error
}

// `throw` is not an expression, so you can't use it like:
// foo || throw new Error('...')
//
// But you can use this instead:
// foo || bail('...')
export function bail(message: string): never {
  let error = new Error(message)
  if (Error.captureStackTrace) Error.captureStackTrace(error, bail)
  throw error
}

let EMPTY = Symbol('EMPTY')
function defaultCacheKey(...args: any[]) {
  if (args.length === 0) {
    return EMPTY
  }

  if (args.length === 1) {
    let arg = args[0]

    if (
      typeof arg === 'string' ||
      typeof arg === 'number' ||
      typeof arg === 'boolean' ||
      typeof arg === 'symbol' ||
      arg === null ||
      arg === undefined
    ) {
      return arg
    }

    if (Array.isArray(arg)) {
      return arg.map((x) => defaultCacheKey(x)).join(',')
    }

    if (typeof arg === 'object') {
      return JSON.stringify(arg)
    }
  }

  return JSON.stringify(args)
}

// Performance
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  cacheKey: (...args: Parameters<T>) => string = defaultCacheKey
): T {
  let cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    let key = cacheKey(...args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    let result = fn(...args)
    cache.set(key, result)

    return result
  }) as T
}

// Class
export class DefaultMap<K = string, V = any> extends Map<K, V> {
  constructor(private factory: (key: K) => V) {
    super()
  }

  get(key: K): V {
    if (!this.has(key)) {
      this.set(key, this.factory(key))
    }

    return super.get(key)!
  }
}

export class Point {
  private static points = new DefaultMap<number, DefaultMap<number, Point>>(
    (x) => new DefaultMap((y) => new Point(x, y))
  )

  private constructor(
    public readonly x: number = 0,
    public readonly y: number = 0
  ) {}

  static new(x: number, y: number) {
    return Point.points.get(x).get(y)
  }

  up(amount = 1) {
    return Point.new(this.x, this.y - amount)
  }

  down(amount = 1) {
    return Point.new(this.x, this.y + amount)
  }

  left(amount = 1) {
    return Point.new(this.x - amount, this.y)
  }

  right(amount = 1) {
    return Point.new(this.x + amount, this.y)
  }

  navigate(direction: Direction, amount = 1) {
    return match(direction, {
      [Direction.North]: () => this.up(amount),
      [Direction.East]: () => this.right(amount),
      [Direction.South]: () => this.down(amount),
      [Direction.West]: () => this.left(amount),
    })
  }

  direction(other: Point) {
    if (this.x === other.x) {
      if (this.y < other.y) return Direction.South
      if (this.y > other.y) return Direction.North
    }

    if (this.y === other.y) {
      if (this.x < other.x) return Direction.East
      if (this.x > other.x) return Direction.West
    }

    return null
  }

  neighbours() {
    return [this.up(), this.right(), this.down(), this.left()]
  }

  manhattanDistanceTo(other: Point) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  tuple() {
    return [this.x, this.y] as const
  }

  toString() {
    return `Point(${this.x}, ${this.y})`
  }
}

export function pointsToGrid(it: Iterable<Point>) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (let point of it) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }

  let width = maxX - minX + 1
  let height = maxY - minY + 1

  let grid: boolean[][] = new Array(height).fill(0).map(() => new Array(width).fill(false))

  for (let point of it) {
    grid[point.y - minY][point.x - minX] = true
  }

  return grid
}

export function pointsToSize<T>(it: Set<Point> | Map<Point, T>) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (let point of it.keys()) {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  }

  let width = maxX - minX + 1
  let height = maxY - minY + 1

  return { width, height }
}

export function rotateGrid<T>(grid: T[][], direction: -90 | 90) {
  return match(direction, {
    [90]: () => transpose(grid).reverse(),
    [-90]: () => transpose(grid).map((row) => row.reverse()),
  })
}

export function transposePointMap<T>(input: Map<Point, T>) {
  let transposed = new Map<Point, T>()
  for (let [point, value] of input.entries()) {
    transposed.set(Point.new(point.y, point.x), value)
  }
  return transposed
}

export function transposePointSet(input: Set<Point>) {
  let transposed = new Set<Point>()
  for (let point of input) {
    transposed.add(Point.new(point.y, point.x))
  }
  return transposed
}

export function visualizePointMap<T>(
  map: Map<Point, T>,
  valueFn: (value: T, point: Point) => string = (x) => x?.toString()
) {
  let { width, height } = pointsToSize(map)
  let grid: string[][] = []

  for (let y = 0; y < height; y++) {
    let row = []
    for (let x = 0; x < width; x++) {
      let p = Point.new(x, y)
      if (map.has(p)) {
        row.push(valueFn(map.get(p)!, p))
      } else {
        row.push(valueFn(null, p))
      }
    }
    grid.push(row)
  }

  return grid.map((row) => row.join('')).join('\n')
}

export enum Direction {
  /** `↑` */
  North = 1 << 0,

  /** `→` */
  East = 1 << 1,

  /** `↓` */
  South = 1 << 2,

  /** `←` */
  West = 1 << 3,
}

export function directionToChar(direction: Direction) {
  return match(direction, {
    [Direction.North]: () => '↑',
    [Direction.East]: () => '→',
    [Direction.South]: () => '↓',
    [Direction.West]: () => '←',
  })
}

export function isOppositeDirection(a: Direction, b: Direction) {
  if (a === Direction.North && b === Direction.South) return true
  if (a === Direction.South && b === Direction.North) return true
  if (a === Direction.East && b === Direction.West) return true
  if (a === Direction.West && b === Direction.East) return true
  return false
}

// Algorithms
export function astar<T>({
  start,
  successors,
  heuristic = () => 0,
  success,
  value = () => 1,
}: {
  start: T
  successors: (node: T) => Iterable<T>
  heuristic?: (node: T) => number
  success: (node: T) => boolean
  value?: (node: T, previous: T) => number
}): [path: T[], cost: number] | null {
  let path = []
  let parent = new Map()

  let g = new DefaultMap<T, number>(() => Infinity)
  g.set(start, 0)

  let f = new DefaultMap<T, number>(() => Infinity)
  f.set(start, g.get(start) + heuristic(start))

  let open = new BinaryHeap((node) => f.get(node), [start])

  while (open.size > 0) {
    let current = open.pop()

    if (success(current)) {
      let node = current
      while (node !== start) {
        path.unshift(node)
        node = parent.get(node)
      }
      path.unshift(start)
      return [path, f.get(current)]
    }

    for (let next of successors(current)) {
      let score = g.get(current) + value(next, current)
      if (score < g.get(next)) {
        parent.set(next, current)
        g.set(next, score)
        f.set(next, score + heuristic(next))
        open.push(next)
      }
    }
  }
}

class BinaryHeap<T> {
  constructor(
    private score: (item: T) => number,
    private data: T[] = []
  ) {}

  push(item: T) {
    this.data.push(item)
    this.sink(this.data.length - 1)
  }

  pop(): T {
    let result = this.data[0]
    let end = this.data.pop()

    if (this.data.length > 0) {
      this.data[0] = end
      this.bubble(0)
    }

    return result
  }

  get size() {
    return this.data.length
  }

  private sink(n: number) {
    let element = this.data[n]

    while (n > 0) {
      let parentN = ((n + 1) >> 1) - 1
      let parent = this.data[parentN]

      if (this.score(element) < this.score(parent)) {
        this.data[parentN] = element
        this.data[n] = parent
        n = parentN
      } else {
        break
      }
    }
  }

  private bubble(n: number) {
    let length = this.data.length
    let element = this.data[n]
    let elemScore = this.score(element)

    while (true) {
      let child2N = (n + 1) << 1
      let child1N = child2N - 1

      let swap = null
      let child1Score: number

      if (child1N < length) {
        let child1 = this.data[child1N]
        child1Score = this.score(child1)

        if (child1Score < elemScore) swap = child1N
      }

      if (child2N < length) {
        let child2 = this.data[child2N]
        let child2Score = this.score(child2)
        if (child2Score < (swap === null ? elemScore : child1Score)) swap = child2N
      }

      if (swap !== null) {
        this.data[n] = this.data[swap]
        this.data[swap] = element
        n = swap
      } else {
        break
      }
    }
  }
}

// Iterator helpers
export function h<T>(it: Iterable<T>) {
  return new IteratorHelpers(it)
}

class IteratorHelpers<T> {
  constructor(private it: Iterable<T>) {}

  first() {
    return this.it[Symbol.iterator]().next().value
  }

  last() {
    let it = this.it[Symbol.iterator]()
    let x = it.next()
    let last = x.value
    while (!x.done) {
      last = x.value
      x = it.next()
    }
    return last
  }

  empty() {
    return this.it[Symbol.iterator]().next().done
  }

  map<U>(fn: (x: T) => U) {
    let it = this.it
    return new IteratorHelpers({
      *[Symbol.iterator]() {
        for (let x of it) {
          yield fn(x)
        }
      },
    })
  }

  every(fn: (x: T) => boolean) {
    for (let x of this.it) {
      if (!fn(x)) return false
    }
    return true
  }

  some(fn: (x: T) => boolean) {
    for (let x of this.it) {
      if (fn(x)) return true
    }
    return false
  }

  collect() {
    return Array.from(this.it)
  }
}
