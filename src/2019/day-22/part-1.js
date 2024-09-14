// Day 22: Slam Shuffle

const { range } = require('../utils')

module.exports = (input, size) => {
  return input.split('\n').reduce((next_deck, action) => {
    if (action === 'deal into new stack') {
      return next_deck.reverse()
    }

    if (action.startsWith('deal with increment')) {
      const amount = Number(action.split(' ').pop())

      return next_deck.reduce((new_deck, value, i) => {
        new_deck[(i * amount) % size] = value
        return new_deck
      }, [])
    }

    if (action.startsWith('cut')) {
      const amount = Number(action.split(' ').pop())
      return [...next_deck.slice(amount), ...next_deck.slice(0, amount)]
    }
  }, range(size))
}
