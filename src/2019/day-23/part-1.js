// Day 23: Category Six

import EventEmitter from 'node:events'
import { collect, createIntcodeComputer } from '../intcode/computer'

export default async (input) => {
  let network = new EventEmitter()

  let NAT = new Promise((resolve) => {
    network.on(255, (x, y) => {
      network.emit('shutdown')
      setTimeout(resolve, 0, y)
    })
  })

  for (let i = 0; i < 50; i++) {
    let network_address = i

    let computer = createIntcodeComputer(input, {
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
  }

  // Get the result
  let result = await NAT
  network.removeAllListeners()
  return result
}
