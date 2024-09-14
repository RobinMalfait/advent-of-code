export function parse(blob) {
  let number = BigInt('0x' + blob.trim())
  let binary = number.toString(2)
  if (binary.length % 4 !== 0) {
    binary = binary.padStart(binary.length + (4 - (binary.length % 4)), '0')
  }

  return _parse(binary)
}

function _parse(binary, state = { ptr: 0 }) {
  let version = readAsNumber(binary, 3, state)
  let typeId = readAsNumber(binary, 3, state)

  // Literal value
  if (typeId === 4) {
    let str = ''
    let repeat = false
    do {
      let number = read(binary, 5, state)
      repeat = number[0] === '1'
      str += number.slice(1)
    } while (repeat)

    return { version, typeId, value: Number.parseInt(str, 2) }
  }

  // Operator(s)
  let lengthTypeId = readAsNumber(binary, 1, state)

  // total length in bits
  if (lengthTypeId === 0) {
    let totalLengthInBits = readAsNumber(binary, 15, state)
    let subPacketsBinary = read(binary, totalLengthInBits, state)

    let substate = { ptr: 0 }
    let packets = []

    while (substate.ptr < subPacketsBinary.length) {
      packets.push(_parse(subPacketsBinary, substate))
    }

    return { version, typeId, packets }
  }

  // number of sub-packets immediately contained
  else if (lengthTypeId === 1) {
    let numberOfSubPackets = readAsNumber(binary, 11, state)
    let packets = []

    while (numberOfSubPackets-- > 0) {
      packets.push(_parse(binary, state))
    }

    return { version, typeId, packets }
  }
}

function read(binary, bits, state) {
  let result = binary.slice(state.ptr, state.ptr + bits)
  state.ptr += bits
  return result
}

function readAsNumber(binary, bits, state) {
  return Number.parseInt(read(binary, bits, state), 2)
}
