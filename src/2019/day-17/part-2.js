// Day 17: Set and Forget

const { createIntcodeComputer } = require('../intcode/computer')

const MAIN_MOVEMENT_ROUTINE = {
  A: 'A'.charCodeAt(0),
  B: 'B'.charCodeAt(0),
  C: 'C'.charCodeAt(0),
}

const TURN = {
  LEFT: 'L'.charCodeAt(0),
  RIGHT: 'R'.charCodeAt(0),
}

const SEPARATOR = ','.charCodeAt(0)
const EOL = '\n'.charCodeAt(0)

function encode(...inputs) {
  return inputs.flatMap((value, index) => [value, index === inputs.length - 1 ? EOL : SEPARATOR])
}

const VISUAL_FEED = {
  YES: encode('y'.charCodeAt(0)),
  NO: encode('n'.charCodeAt(0)),
}

const possible_actions = 'ABCLRyn,\n'.split('').map((v) => v.charCodeAt(0))
const SPECIAL_CASES = {
  '\n': '⏎',
}

function decode(feed) {
  return feed
    .map((value) => {
      const string = possible_actions.includes(value) ? String.fromCharCode(value) : value
      return SPECIAL_CASES[string] || string
    })
    .join('')
}

const encoded_main = encode(MAIN_MOVEMENT_ROUTINE.A, MAIN_MOVEMENT_ROUTINE.A, MAIN_MOVEMENT_ROUTINE.B, MAIN_MOVEMENT_ROUTINE.C)

// R4L12L8R4L8
// const encoded_A = encode(
//   TURN.RIGHT,
//   4,
//   TURN.LEFT,
//   12,
//   TURN.LEFT,
//   8,
//   TURN.RIGHT,
//   4,
//   TURN.LEFT,
//   8
// );

function encodeRaw(input) {
  return encode(
    ...input.split(',').map((v) => {
      if (v == Number(v)) {
        return Number(v)
      }

      return v.charCodeAt(0)
    })
  )
}

const MAIN = encodeRaw('A')
const A = encodeRaw('R,4,L,12,L,8')
const B = encodeRaw('') //"R,4,R,4,R,8");
const C = encodeRaw('') //"L,6,L,2");

module.exports = async function ASCII(input) {
  const computer = createIntcodeComputer(input)
  let buffer = ''
  computer.output((value, index) => {
    if (value > 1000) {
      console.log('value:', value)
    }
    buffer += String.fromCharCode(value)
  })

  computer.input(MAIN)
  computer.input(A)
  computer.input(B)
  computer.input(C)
  // computer.input(encoded_B);
  // computer.input(encoded_C);
  computer.input(VISUAL_FEED.NO)

  await computer.run()

  const positions = new Map()
  // const board = buffer.split("\n");
  console.log(buffer)

  // Let's create a positions maps
  // board.forEach((row, y) => {
  //   row.split("").forEach((cell, x) => {
  //     positions.set(point(x, y), cell);
  //   });
  // });

  // const neighbours = [
  //   { x: 0, y: -1 },
  //   { x: 0, y: 1 },
  //   { x: -1, y: 0 },
  //   { x: 0, y: 1 }
  // ];

  // // Find all intersections
  // return [...positions.entries()].reduce((total, [position, tile]) => {
  //   if (tile !== "#") {
  //     return total;
  //   }

  //   const me = fromPoint(position);
  //   const surrounded_by_hashtags = neighbours.every(({ x, y }) => {
  //     const neighbour_position = point(me.x + x, me.y + y);
  //     return (
  //       positions.has(neighbour_position) &&
  //       positions.get(neighbour_position) === "#"
  //     );
  //   });

  //   return surrounded_by_hashtags ? total + me.x * me.y : total;
  // }, 0);
}

function point(x, y) {
  return `(${x}, ${y})`
}

function fromPoint(point) {
  const [x, y] = point.slice(1, -1).split(', ').map(Number)

  return { x, y }
}
