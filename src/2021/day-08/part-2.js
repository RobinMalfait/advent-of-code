export default function (blob) {
  let lines = blob
    .trim()
    .split('\n')
    .map((line) => line.split(' | ').map((line) => line.split(' ')))
    .map(([patterns, output]) => [patterns.map(asBits), output.map(asBits)])

  let total = 0
  for (let [patterns, outputs] of lines) {
    let map = rewire(patterns, outputs)
    let subtotal = 0

    for (let digit of outputs) {
      subtotal *= 10
      subtotal += map.indexOf(digit)
    }

    total += subtotal
  }

  return total
}

function contains(a, b) {
  return (a & b) === b
}

function asBits(input) {
  let bits = 0
  let offset = 'a'.charCodeAt(0)

  for (let char of input) {
    bits |= 1 << (char.charCodeAt(0) - offset)
  }

  return bits
}

function count(digit) {
  let total = 0

  while (digit) {
    digit &= digit - 1
    total++
  }

  return total
}

function rewire(patterns) {
  // count = 2 results in 1
  // count = 3 results in 7
  // count = 4 results in 4
  // count = 7 results in 8
  let known = {
    2: 1,
    3: 7,
    4: 4,
    7: 8,
  }

  // Deduce:
  // count = 6 and contains 4 results in 9
  // count = 5 and contains 1 results in 3
  // count = 6 and contains 1 results in 0
  // count = 6 results in 6
  // count = 5 and is contained in 6 results in 5
  // count = 5 results in 2
  let todo = []
  let map = []

  for (let digit of patterns) {
    let segments = count(digit)
    if (segments in known) {
      map[known[segments]] = digit
    } else {
      todo.push(digit)
    }
  }

  for (let digit of todo.slice()) {
    if (count(digit) === 6 && contains(digit, map[4])) {
      map[9] = digit
    } else if (count(digit) === 5 && contains(digit, map[1])) {
      map[3] = digit
    } else {
      todo.push(digit)
    }
  }

  for (let digit of todo.slice()) {
    if (count(digit) === 6 && contains(digit, map[1])) {
      map[0] = digit
    } else {
      todo.push(digit)
    }
  }

  for (let digit of todo.slice()) {
    if (count(digit) === 6) {
      map[6] = digit
    } else {
      todo.push(digit)
    }
  }

  for (let digit of todo) {
    if (count(digit) === 5 && contains(map[6], digit)) {
      map[5] = digit
    } else {
      map[2] = digit
    }
  }

  return map
}
