// Day 23: Category Six

import EventEmitter from 'node:events'
import { collect, createIntcodeComputer } from '../intcode/computer'

export default async (input) => {
  const network = new EventEmitter()
  const mem = { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY }
  const computers = []

  const NAT = new Promise((resolve) => {
    network.on(255, (x, y) => {
      if (computers.length === 50 && computers.every((computer) => computer.isInputPending)) {
        // Send x,y to computer 0
        network.emit(0, x, y)

        // Send twice the same y?
        if (mem.y === y) {
          network.emit('shutdown')
          setTimeout(resolve, 0, y)
        }

        mem.x = x
        mem.y = y
      }
    })
  })

  for (let i = 0; i < 50; i++) {
    const network_address = i

    const computer = createIntcodeComputer(input, {
      waitForInput: () => -1,
    })

    // Feed it its identity aka network address
    computer.input(network_address)

    // Shutdown the computer when the network shuts down
    network.once('shutdown', () => computer.halt())

    // Listen for input on the network
    network.on(network_address, (x, y) => computer.input(x, y))

    // Read instructions
    computer.output(collect(3, (dest, x, y) => network.emit(dest, x, y)))

    // Got network address, let's go
    computer.run()

    computers.push(computer)
  }

  // Get the result
  const result = await NAT
  network.removeAllListeners()
  return result
}
