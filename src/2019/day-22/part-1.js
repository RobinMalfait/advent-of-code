// Day 22: Slam Shuffle

import { range } from '../utils'

export default (input, size) => {
  return input.split('\n').reduce((next_deck, action) => {
    if (action === 'deal into new stack') {
      return next_deck.reverse()
    }

    if (action.startsWith('deal with increment')) {
      let amount = Number(action.split(' ').pop())

      return next_deck.reduce((new_deck, value, i) => {
        new_deck[(i * amount) % size] = value
        return new_deck
      }, [])
    }

    if (action.startsWith('cut')) {
      let amount = Number(action.split(' ').pop())
      return [...next_deck.slice(amount), ...next_deck.slice(0, amount)]
    }
  }, range(size))
}
