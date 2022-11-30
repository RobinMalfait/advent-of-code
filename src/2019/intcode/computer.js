const EventEmitter = require('events')
const { match, abort, aborted } = require('../utils')

const PARAMETER_MODES = { POSITION: 0, IMMEDIATE: 1, RELATIVE: 2 }
const PROGRAM_MODES = { OUTPUT: 0, MEMORY: 1, ALL: 2, input: 3 }
const IO = { IN: 'input', OUT: 'output' }
const STATE = { IDLE: 0, RUNNING: 1, HALTED: 2 }

const OP = {
  HALT: 99,
  ADDITION: 1,
  MULTIPLICATION: 2,
  READ: 3,
  WRITE: 4,
  JUMP_IF_TRUE: 5,
  JUMP_IF_FALSE: 6,
  LESS_THAN: 7,
  EQUALS: 8,
  ADJUST_RELATIVE_BASE: 9,
}

const PROGRAM_OUTPUT_HANDLERS = {
  [PROGRAM_MODES.OUTPUT](state) {
    return state.output
  },
  [PROGRAM_MODES.INPUT](state) {
    return state.input
  },
  [PROGRAM_MODES.MEMORY](state) {
    return state.memory
  },
  [PROGRAM_MODES.ALL](state) {
    return {
      memory: state.memory,
      output: state.output,
      input: state.input,
    }
  },
}

const OP_HANDLERS = {
  [OP.HALT]() {
    abort()
  },
  [OP.ADDITION](op) {
    op.write(op.readParam() + op.readParam())
  },
  [OP.MULTIPLICATION](op) {
    op.write(op.readParam() * op.readParam())
  },
  async [OP.READ](op, state) {
    op.write(await readInput(state))
  },
  [OP.WRITE](op, state) {
    state.brain.emit(IO.OUT, op.readParam(), state.output.length)
  },
  [OP.JUMP_IF_TRUE](op) {
    const param1 = op.readParam()
    const param2 = op.readParam()

    if (param1 !== 0) {
      return param2 // Returning the new position
    }
  },
  [OP.JUMP_IF_FALSE](op) {
    const param1 = op.readParam()
    const param2 = op.readParam()

    if (param1 === 0) {
      return param2 // Returning the new position
    }
  },
  [OP.LESS_THAN](op) {
    op.write(op.readParam() < op.readParam() ? 1 : 0)
  },
  [OP.EQUALS](op) {
    op.write(op.readParam() === op.readParam() ? 1 : 0)
  },
  [OP.ADJUST_RELATIVE_BASE](op, state) {
    state.relative_base_pointer += op.readParam()
  },
}

function readInput(state) {
  return state.input.length > 0 ? state.input.shift() : state.waitForInput()
}

function createIntcodeComputer(program = '', OPTIONS = {}) {
  const { mode = PROGRAM_MODES.OUTPUT, waitForInput } = OPTIONS

  // Let's create a state bucket where we can store stuff, and make it easy to
  // pass around.
  const state = {
    state: STATE.IDLE,

    // Keep track of the memory
    memory: program.split(',').map(Number),

    // Keep track of IO
    input: [],
    output: [],

    // Keep track of some pointers
    instruction_pointer: 0,
    relative_base_pointer: 0,

    // Add an event emitter so that we can do some message passing
    brain: new EventEmitter(),

    // Provide a way to wait for input
    waitForInput:
      waitForInput !== undefined
        ? waitForInput
        : async () => {
            await new Promise(state.brain.once.bind(state.brain, IO.IN))
            return await readInput(state)
          },
  }

  // Handle I/O
  state.brain.on(IO.IN, (values) => state.input.push(...values))
  state.brain.on(IO.OUT, (value) => state.output.push(value))

  // The computah
  async function IntcodeComputer() {
    try {
      while (state.instruction_pointer < state.memory.length && state.state === STATE.RUNNING) {
        const operator = parseOperator(state)

        const next_position = await match(operator.operation, OP_HANDLERS, operator, state)

        if (next_position != null) {
          state.instruction_pointer = next_position
        } else {
          state.instruction_pointer += operator.advance()
        }
      }
    } catch (err) {
      if (!aborted(err)) {
        throw err
      }
    } finally {
      state.brain.removeAllListeners()
    }

    return match(mode, PROGRAM_OUTPUT_HANDLERS, state)
  }

  return {
    run() {
      state.state = STATE.RUNNING
      return IntcodeComputer()
    },
    input(...values) {
      if (state.state === STATE.HALTED) {
        return
      }

      const flattened = values.flat(Infinity)
      if (flattened.some((v) => typeof v !== 'number')) {
        throw new Error('Inputs must be of type number')
      }

      if (flattened.length > 0) {
        state.brain.emit(IO.IN, flattened)
      }
    },
    output(cb) {
      if (state.state === STATE.HALTED) {
        return
      }

      state.brain.on(IO.OUT, cb)
      return () => state.brain.off(IO.OUT, cb)
    },

    // Expose a way to abort the computer from running
    halt() {
      state.state = STATE.HALTED
    },

    get isInputPending() {
      return state.input.length === 0
    },
  }
}

const OPERATOR_MODE_HANDLERS = {
  [PARAMETER_MODES.POSITION](position, state) {
    return state.memory[position]
  },
  [PARAMETER_MODES.IMMEDIATE](position) {
    return position
  },
  [PARAMETER_MODES.RELATIVE](position, state) {
    return state.memory[position] + state.relative_base_pointer
  },
}

function resolvePosition(operator_state, computer_state) {
  const position = ++operator_state.local_instruction_pointer

  // Find the actual mode
  const mode = operator_state.next_mode % 10 | 0

  // Prep the next_mode
  operator_state.next_mode /= 10

  // Get the position from memory based on the PARAMETER_MODE
  return match(mode, OPERATOR_MODE_HANDLERS, position, computer_state)
}

function parseOperator(computer_state) {
  const input = computer_state.memory[computer_state.instruction_pointer]
  if (typeof input !== 'number') {
    throw new Error(`No no... "${input}" (${typeof input})`)
  }

  const operator_state = {
    operation: input % 100, // Last 3 digits
    next_mode: (input / 100) | 0,

    // Keep track of a local instruction pointer so that we can increase this
    // for our parameters
    local_instruction_pointer: computer_state.instruction_pointer,
  }

  return {
    // Expose the operation
    operation: operator_state.operation,

    // Expose a set of utils
    readParam() {
      const value = computer_state.memory[resolvePosition(operator_state, computer_state)]

      return value == null ? 0 : value
    },
    write(value) {
      computer_state.memory[resolvePosition(operator_state, computer_state)] = value
    },
    advance() {
      return operator_state.local_instruction_pointer - computer_state.instruction_pointer + 1
    },
  }
}

function collect(amount, cb) {
  let collection = []
  return (value) => {
    collection.push(value)
    if (collection.length === amount) {
      cb(...collection.splice(0, amount))
    }
  }
}

module.exports = { PROGRAM_MODES, createIntcodeComputer, collect }
