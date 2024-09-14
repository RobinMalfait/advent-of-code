export default function (blob: string, multiplier = 1) {
  return play(parse(blob.trim(), multiplier))
}

function play(info: ReturnType<typeof parse>) {
  let players = Array(info.players).fill(0)
  let marbles = new Deque<number>()

  marbles.pushBack(0)

  for (let step = 1; step <= info.marbles; step++) {
    let player = step % info.players

    if (step % 23 === 0) {
      // Move 6 counter-clockwise
      marbles.pushFront(marbles.popBack())
      marbles.pushFront(marbles.popBack())
      marbles.pushFront(marbles.popBack())
      marbles.pushFront(marbles.popBack())
      marbles.pushFront(marbles.popBack())
      marbles.pushFront(marbles.popBack())

      // 7th marble
      players[player] += step + marbles.popBack()
    } else {
      // Move 2 clockwise
      marbles.pushBack(marbles.popFront())
      marbles.pushBack(marbles.popFront())

      marbles.pushFront(step)
    }
  }

  return players.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY)
}

function parse(input: string, multiplier = 1) {
  let { players, marbles } = /(?<players>\d+).*?(?<marbles>\d+).*/.exec(input).groups
  return { players: Number(players), marbles: Number(marbles) * multiplier }
}

// API based on the VecDeque struct in Rust
class Deque<T> {
  private head = 0
  private tail = 0

  private items: T[] = []

  pushFront(item: T) {
    if (this.tail > 0) {
      this.tail--
      this.items[this.tail] = item
    } else {
      for (let i = this.head; i > 0; i--) {
        this.items[i] = this.items[i - 1]
      }
      this.head++
      this.items[0] = item
    }
  }

  pushBack(item: T) {
    this.items[this.head] = item
    this.head++
  }

  popFront(): T {
    let value = this.items[this.tail]
    this.items[this.tail] = undefined
    this.tail++
    return value
  }

  popBack(): T {
    let value = this.items[this.head - 1]
    this.items[this.head - 1] = undefined
    this.head--
    return value
  }
}
