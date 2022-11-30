import { parse } from './parse.js'

export default function (blob) {
  return evaluate(parse(blob))
}

function evaluate(packet) {
  switch (packet.typeId) {
    // Sum
    case 0: {
      let total = 0
      for (let other of packet.packets) {
        total += evaluate(other)
      }
      return total
    }

    // Product
    case 1: {
      let total = 1
      for (let other of packet.packets) {
        total *= evaluate(other)
      }
      return total
    }

    // Minimum
    case 2: {
      let min = Number.MAX_SAFE_INTEGER
      for (let other of packet.packets) {
        let value = evaluate(other)
        if (value < min) {
          min = value
        }
      }
      return min
    }

    // Maximum
    case 3: {
      let min = Number.MIN_SAFE_INTEGER
      for (let other of packet.packets) {
        let value = evaluate(other)
        if (value > min) {
          min = value
        }
      }
      return min
    }

    // Literal
    case 4: {
      return packet.value
    }

    // Greater than
    case 5: {
      return evaluate(packet.packets[0]) > evaluate(packet.packets[1]) ? 1 : 0
    }

    // Less than
    case 6: {
      return evaluate(packet.packets[0]) < evaluate(packet.packets[1]) ? 1 : 0
    }

    // Equal to
    case 7: {
      return evaluate(packet.packets[0]) === evaluate(packet.packets[1]) ? 1 : 0
    }

    // Unreachable
    default: {
      throw new Error('Unknown typeId: ' + packet.typeId)
    }
  }
}
