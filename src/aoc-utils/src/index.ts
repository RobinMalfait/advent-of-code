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

// Set
export function intersection<T>(a: T[], b: T[]) {
  return new Set(a.filter((x) => b.includes(x)))
}

// Class
export class DefaultMap<TKey = string, TValue = any> extends Map<TKey, TValue> {
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

export class Point {
  private static points = new DefaultMap<number, DefaultMap<number, Point>>((x) => new DefaultMap((y) => new Point(x, y)))

  private constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  static new(x: number, y: number) {
    return Point.points.get(x).get(y)
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
