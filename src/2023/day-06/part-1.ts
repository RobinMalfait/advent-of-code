export default function (blob: string) {
  let total = 1

  for (let [time, record] of parse(blob.trim())) {
    let wins = 0
    for (let i = 1; i < time; i++) {
      let distance = (time - i) * i
      if (distance > record) {
        wins++
      }
    }
    total *= wins
  }

  return total
}

function parse(input: string) {
  return zip(input.split('\n').map((line) => line.trim().split(':').slice(1)[0].trim().split(/\s+/g).map(Number)))
}

function zip<T>(input: T[][]) {
  return input[0].map((_, i) => input.map((array) => array[i]))
}
