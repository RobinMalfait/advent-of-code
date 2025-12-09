import { AsyncLocalStorage } from 'async_hooks'
import util from 'node:util'

// See: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#:~:text=Symbol.dispose,-??=%20Symbol(%22Symbol.dispose
// @ts-expect-error — Ensure Symbol.dispose exists
Symbol.dispose ??= Symbol('Symbol.dispose')
// @ts-expect-error — Ensure Symbol.asyncDispose exists
Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose')

// Class
export class DefaultMap<K = string, V = unknown> extends Map<K, V> {
  constructor(private factory: (key: K) => V) {
    super()
  }

  get(key: K): V {
    let value = super.get(key)

    if (value === undefined) {
      value = this.factory(key)
      this.set(key, value)
    }

    return value
  }
}

// Math
export function lcm(x: number, y: number) {
  return x === 0 || y === 0 ? 0 : Math.abs((x * y) / gcd(x, y))
}

export function gcd(x: number, y: number) {
  while (y !== 0) {
    let tmp = y
    y = x % y
    x = tmp
  }
  return x
}

export function degrees(radians: number) {
  return radians * (180 / Math.PI)
}

export function radians(degrees: number) {
  return degrees * (Math.PI / 180)
}

let chooses = new DefaultMap((n: number) => {
  return new DefaultMap((k: number) => {
    if (k > n) return 0
    return factorial(n) / (factorial(k) * factorial(n - k))
  })
})

export function choose(n: number, k: number) {
  return chooses.get(n).get(k)
}

let factorials = new DefaultMap<number, number>((n) => {
  if (n === 0) return 1
  if (n === 1) return 1
  return n * factorials.get(n - 1)
})

export function factorial(n: number): number {
  return factorials.get(n)
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
export function* windows<T>(input: Iterable<T>, size: number): Generator<T[]> {
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
export function intersectionArrays<T>(a: T[], b: T[]) {
  return new Set(a.filter((x) => b.includes(x)))
}

Set.prototype.intersection ??= function <T>(other: Set<T>) {
  let result = new Set<T>()
  for (let x of this) {
    if (other.has(x)) {
      result.add(x)
    }
  }
  return result
}

Set.prototype.isDisjointFrom ??= function <T>(other: Set<T>) {
  for (let x of this) {
    if (other.has(x)) return false
  }
  return true
}

Set.prototype.union ??= function <T>(other: Set<T>) {
  let result = new Set(this)
  for (let x of other) {
    result.add(x)
  }
  return result
}

// Flow control
export function match<T extends string | number = string, R = unknown>(
  value: T,
  lookup: Record<T, R | ((...args: unknown[]) => R)>,
  ...args: unknown[]
): R {
  if (value in lookup) {
    let returnValue = lookup[value]
    return typeof returnValue === 'function' ? returnValue(...args) : returnValue
  }

  let error = new Error(
    `Tried to handle "${value}" but there is no handler defined. Only defined handlers are: ${Object.keys(
      lookup,
    )
      .map((key) => `"${key}"`)
      .join(', ')}.`,
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
function defaultCacheKey(...args: unknown[]) {
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
export function memoize<T extends (...args: unknown[]) => R, R>(
  fn: T,
  cacheKey: (...args: Parameters<T>) => string = defaultCacheKey,
): T {
  let cache = new Map<string, R>()

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

export class Range {
  constructor(
    /** Inclusive */
    public readonly start: number,
    /** Exclusive */
    public readonly end: number,
  ) {}

  get size() {
    return this.end - this.start + 1
  }

  static fromString(input: string) {
    let [start, end] = input.split('-').map(Number)
    return new Range(start, end)
  }

  static mergeOverlapping(ranges: Range[]) {
    if (ranges.length === 0) return []

    ranges.sort((a, b) => a.start - b.start || b.end - a.end)

    let merged: Range[] = []
    let current = ranges[0]

    for (let i = 1; i < ranges.length; i++) {
      let next = ranges[i]

      // Fits within current
      if (current.end >= next.end) {
        // Already merged, no need to create a new range
      }

      // Overlapping, combine ranges
      else if (current.end >= next.start - 1) {
        current = new Range(current.start, next.end)
      }

      // No touchy, next range
      else {
        merged.push(current)
        current = next
      }
    }

    // Track the last range
    merged.push(current)

    return merged
  }

  contains(value: number) {
    return this.start <= value && value <= this.end
  }

  split(value: number) {
    return [new Range(this.start, value - 1), new Range(value, this.end)]
  }

  overlaps(other: Range) {
    return this.start <= other.end && other.start <= this.end
  }

  [util.inspect.custom]() {
    return this.toString()
  }

  toString() {
    return `Range(${this.start}, ${this.end})`
  }
}

export class Point {
  private static points = new DefaultMap<number, DefaultMap<number, Point>>(
    (x) => new DefaultMap((y) => new Point(x, y)),
  )

  private constructor(
    public readonly x: number = 0,
    public readonly y: number = 0,
  ) {}

  static new(x: number, y: number) {
    return Point.points.get(x).get(y)
  }

  static fromString(input: string) {
    let [x, y] = input.split(',').map(Number)
    return Point.points.get(x).get(y)
  }

  add(other: Point) {
    return Point.new(this.x + other.x, this.y + other.y)
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

  ne() {
    return this.add(Point.new(1, -1))
  }

  nw() {
    return this.add(Point.new(-1, -1))
  }

  se() {
    return this.add(Point.new(1, 1))
  }

  sw() {
    return this.add(Point.new(-1, 1))
  }

  navigate(direction: Direction, amount = 1) {
    if (direction === Direction.North) return this.up(amount)
    if (direction === Direction.East) return this.right(amount)
    if (direction === Direction.South) return this.down(amount)
    if (direction === Direction.West) return this.left(amount)
    direction satisfies never
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

  neighbours8() {
    return [
      this.up(),
      this.up().right(),
      this.right(),
      this.down().right(),
      this.down(),
      this.down().left(),
      this.left(),
      this.up().left(),
    ]
  }

  manhattanDistanceTo(other: Point) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y)
  }

  isWithinBounds({ width, height }: { width: number; height: number }) {
    return this.x >= 0 && this.x < width && this.y >= 0 && this.y < height
  }

  tuple() {
    return [this.x, this.y] as const
  }

  toString() {
    return `Point(${this.x}, ${this.y})`
  }
}

export const SKIP: unique symbol = Symbol('SKIP')
export function parseIntoGrid<T = string>(
  input: string,
  value: (x: string, p: Point) => T = (x) => x as T,
) {
  let grid = new Map<Point, Exclude<T, typeof SKIP>>()

  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  for (let [y, line] of input.trim().split('\n').entries()) {
    for (let [x, cell] of line.trim().split('').entries()) {
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)

      let p = Point.new(x, y)
      let v = value(cell, p)
      if (v === SKIP) continue
      grid.set(p, v as Exclude<T, typeof SKIP>)
    }
  }

  let width = maxX - minX + 1
  let height = maxY - minY + 1

  return Object.assign(grid, { width, height })
}

export function parseIntoPoints(input: string, include: (x: string, p: Point) => boolean) {
  let points = new Set<Point>()

  for (let [y, line] of input.trim().split('\n').entries()) {
    for (let [x, cell] of line.trim().split('').entries()) {
      let p = Point.new(x, y)
      if (include(cell, p)) {
        points.add(p)
      }
    }
  }

  return points
}

export function pointsToGrid(it: Iterable<Point>) {
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

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
  let minX = Number.POSITIVE_INFINITY
  let minY = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

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
  if (direction === 90) return transpose(grid).reverse()
  if (direction === -90) return transpose(grid).map((row) => row.reverse())
  direction satisfies never
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

// Polygon area using the Shoelace formula + Pick's theorem
// - https://en.wikipedia.org/wiki/Shoelace_formula
// - https://en.wikipedia.org/wiki/Pick%27s_theorem
export function polygonArea(vertices: Point[]) {
  let area = 0
  let perimeter = 0
  let previous = vertices[vertices.length - 1]

  for (let vertex of vertices) {
    area += previous.x * vertex.y - vertex.x * previous.y
    perimeter += Math.abs(vertex.x - previous.x) + Math.abs(vertex.y - previous.y)
    previous = vertex
  }

  return (Math.abs(area) + perimeter) / 2 + 1
}

export function visualizePointMap<T>(
  map: Map<Point, T>,
  valueFn: (value: T, point: Point) => string = (x) => x?.toString() ?? ' ',
) {
  let { width, height } = pointsToSize(map)
  let grid: string[][] = []

  for (let y = 0; y < height; y++) {
    let row = []
    for (let x = 0; x < width; x++) {
      let p = Point.new(x, y)
      let value = map.get(p) ?? null
      row.push(valueFn(value, p))
    }
    grid.push(row)
  }

  return grid.map((row) => row.join('')).join('\n')
}

// Bron-Kerbosch algorithm: for finding all maximal cliques in an undirected
// graph.
export function maximalCliques<T>(grid: Map<T, Set<T>>) {
  return inner(new Set(), new Set(grid.keys()), new Set(), grid)

  function* inner(R: Set<T>, P: Set<T>, X: Set<T>, G: Map<T, Set<T>>) {
    if (P.size === 0 && X.size === 0) {
      yield R
    }

    for (let v of P) {
      yield* inner(R.union(new Set([v])), P.intersection(G.get(v)), X.intersection(G.get(v)), G)
      P.delete(v)
      X.add(v)
    }
  }
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

export function parseDirection(str: string): Direction {
  if (str === '^') return Direction.North
  if (str === '>') return Direction.East
  if (str === 'v') return Direction.South
  if (str === '<') return Direction.West
  return bail(`Invalid direction: ${JSON.stringify(str)}`)
}

export function directionToChar(direction: Direction) {
  if (direction === Direction.North) return '↑'
  if (direction === Direction.East) return '→'
  if (direction === Direction.South) return '↓'
  if (direction === Direction.West) return '←'
  direction satisfies never
}

export function isOppositeDirection(a: Direction, b: Direction) {
  if (a === Direction.North && b === Direction.South) return true
  if (a === Direction.South && b === Direction.North) return true
  if (a === Direction.East && b === Direction.West) return true
  if (a === Direction.West && b === Direction.East) return true
  return false
}

export function rotateDirection(direction: Direction, degrees: 90 | -90 | 180) {
  if (degrees === 90) {
    if (direction === Direction.North) return Direction.East
    if (direction === Direction.East) return Direction.South
    if (direction === Direction.South) return Direction.West
    if (direction === Direction.West) return Direction.North
    direction satisfies never
  } else if (degrees === -90) {
    if (direction === Direction.North) return Direction.West
    if (direction === Direction.West) return Direction.South
    if (direction === Direction.South) return Direction.East
    if (direction === Direction.East) return Direction.North
    direction satisfies never
  } else if (degrees === 180) {
    if (direction === Direction.North) return Direction.South
    if (direction === Direction.South) return Direction.North
    if (direction === Direction.East) return Direction.West
    if (direction === Direction.West) return Direction.East
    direction satisfies never
  }
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

  let g = new DefaultMap<T, number>(() => Number.POSITIVE_INFINITY)
  g.set(start, 0)

  let f = new DefaultMap<T, number>(() => Number.POSITIVE_INFINITY)
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

  return null
}

class BinaryHeap<T> {
  constructor(
    private score: (item: T) => number,
    private data: T[] = [],
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

export function stack<T>(initial: T[] = []) {
  let data: T[] = initial

  let api = {
    push(item: T) {
      data.push(item)
    },
    *iter() {
      while (data.length > 0) {
        yield data.pop()
      }
    },
    *[Symbol.iterator]() {
      yield* api.iter()
    },
  }

  return api
}

// Queue
export function queue<T>(initial: T[] = []) {
  let data: T[] = initial

  let api = {
    push(item: T) {
      data.push(item)
    },
    *iter() {
      while (data.length > 0) {
        yield data.shift()
      }
    },
    *[Symbol.iterator]() {
      yield* api.iter()
    },
  }

  return api
}

export function uniqueQueue<T>(initial: T[] = []) {
  let data: T[] = initial
  let seen = new Set<T>()

  let api = {
    push(item: T) {
      if (seen.has(item)) return
      data.push(item)
    },
    *iter() {
      while (data.length > 0) {
        let next = data.shift()

        if (seen.has(next)) continue
        seen.add(next)

        yield next
      }
    },
    *[Symbol.iterator]() {
      yield* api.iter()
    },
  }

  return api
}

export function priorityQueue<T>(scoreFn: (item: T) => number, initial: T[] = []) {
  let heap = new BinaryHeap<T>(scoreFn, initial)

  let api = {
    push(item: T) {
      heap.push(item)
    },
    *iter() {
      while (heap.size > 0) {
        yield heap.pop()
      }
    },
    *[Symbol.iterator]() {
      yield* api.iter()
    },
  }
  return api
}

// Instrumentation
interface Span {
  id: string
  label: string
  namespace: string
  value: bigint
  parent: Span | null
  spans: Span[]
}

export class Instrumentation implements Disposable {
  #hits = new DefaultMap(() => ({ value: 0 }))
  #timers = new DefaultMap(() => ({ value: 0n }))
  #timerStack: { id: string; label: string; namespace: string; value: bigint }[] = []
  defaultFlush: (message: string) => void

  #storage = new AsyncLocalStorage<Span>()

  constructor(defaultFlush = (message: string) => void process.stderr.write(`${message}\n`)) {
    this.defaultFlush = defaultFlush
  }

  hit(label: string) {
    this.#hits.get(label).value++
  }

  getNamespace() {
    let parent = this.#storage.getStore() || null
    if (parent === null) return []

    let namespace: string[] = []
    while (parent) {
      namespace.unshift(parent.label)
      parent = parent.parent
    }
    return namespace
  }

  #start(label: string) {
    let parent = this.#storage.getStore() || null
    let namespace = this.getNamespace().join('//')
    let id = `${namespace}${namespace.length === 0 ? '' : '//'}${label}`

    this.#hits.get(id).value++

    // Create the timer if it doesn't exist yet
    this.#timers.get(id)

    let span = {
      id,
      label,
      namespace,
      value: process.hrtime.bigint(),
      spans: [],
      parent,
    } satisfies Span

    if (parent) {
      parent.spans.push(span)
    }

    return span
  }

  #end(span: Span) {
    let end = process.hrtime.bigint()
    let elapsed = end - span.value
    this.#timers.get(span.id).value += elapsed
  }

  span<T>(label: string, fn: () => T): T {
    let tree = this.#start(label)

    return this.#storage.run(tree, () => {
      let isPromise = false
      try {
        let result = fn()

        isPromise = result && typeof (result as any).then === 'function'

        // @ts-expect-error — TS can't infer that result is a Promise here
        return isPromise ? result.finally(() => this.#end(tree)) : result
      } finally {
        if (!isPromise) this.#end(tree)
      }
    })
  }

  reset() {
    this.#hits.clear()
    this.#timers.clear()
    this.#timerStack.splice(0)
  }

  report(flush = this.defaultFlush) {
    let output: string[] = []

    // Compute times and find max width
    let computed = new Map<string, string>()
    let max = 0
    for (let [label, { value }] of this.#timers) {
      let x = `${(Number(value) / 1e6).toFixed(2)}ms`
      computed.set(label, x)
      max = Math.max(max, x.length)
    }

    // Build tree structure
    interface Node {
      label: string
      full: string
      children: Node[]
    }
    let roots: Node[] = []
    let nodes = new Map<string, Node>()

    for (let label of this.#timers.keys()) {
      let parts = label.split('//')
      let node: Node = nodes.get(label) ?? { label: parts.at(-1)!, full: label, children: [] }
      nodes.set(label, node)

      if (parts.length === 1) {
        roots.push(node)
      } else {
        let parentKey = parts.slice(0, -1).join('//')
        let parent = nodes.get(parentKey)
        if (!parent) {
          parent = { label: parts.at(-2)!, full: parentKey, children: [] }
          nodes.set(parentKey, parent)
          roots.push(parent)
        }
        parent.children.push(node)
      }
    }

    // Preserve original insertion order for siblings
    function sortChildren(node: Node) {
      let keys = Array.from(computed.keys())
      node.children.sort((a, b) => keys.indexOf(a.full) - keys.indexOf(b.full))
      node.children.forEach(sortChildren)
    }
    roots.forEach(sortChildren)

    let hits = this.#hits
    function print(node: Node, depth = 0) {
      let time = computed.get(node.full) ?? ''
      let count = hits.get(node.full)?.value ?? 1
      let line = `${dim(`[${time.padStart(max, ' ')}]`)}${'  '.repeat(depth)}${
        depth === 0 ? ' ' : dim(' ↳ ')
      }${node.label}${count === 1 ? '' : ` ${dim(blue(`× ${count}`))}`}`
      output.push(line.trimEnd())

      for (let child of node.children) print(child, depth + 1)
    }

    for (let root of roots) print(root)

    flush(`\n${output.join('\n')}\n`)
    this.reset()
  }

  [Symbol.dispose]() {
    process.env.DEBUG === '1' && this.report()
  }
}

export const I = new Instrumentation()

function dim(text: string) {
  return `\x1b[2m${text}\x1b[0m`
}

function blue(text: string) {
  return `\x1b[34m${text}\x1b[0m`
}
