// Day 8: Space Image Format

const { chunk, range } = require('../utils')

const BLACK = '0'
const WHITE = '1'
const TRANSPARENT = '2'

function process(data, width, height) {
  return Promise.resolve({ data, width, height })
}

function flatten() {
  return ({ data, width, height }) => {
    const layers = chunk(data, width * height)

    const flattened = layers.reduce(
      (final_layer, layer) => {
        if (!final_layer.includes(TRANSPARENT)) {
          return final_layer
        }

        return final_layer
          .split('')
          .map((value, index) => (value === TRANSPARENT ? layer[index] : value))
          .join('')
      },
      TRANSPARENT.repeat(width * height)
    )

    return { data: flattened, width, height }
  }
}

const PIXELS = {
  [BLACK]: '▒',
  [WHITE]: '█',
  [TRANSPARENT]: '░',
}

function render(lookup = PIXELS) {
  return ({ data, width }) => {
    const image_with_pixels = data.split('').map((value) => lookup[value])
    const image = chunk(image_with_pixels.join(''), width).join('\n')
    return `\n${image}\n`
  }
}

function scale(factorX = 1, factorY = factorX) {
  return ({ data, width, height }) => {
    const next_width = width * factorX
    const next_height = height * factorY

    const canvas = chunk(data, width).map((row) => {
      // Scale the x-axis
      const next_row = row
        .split('')
        .map((value) => value.repeat(factorX))
        .join('')

      // Scale the y-axis
      return range(factorY)
        .map(() => next_row)
        .join('')
    })

    return {
      data: canvas.join(''),
      width: next_width,
      height: next_height,
    }
  }
}

function border(top = 0, right = top, bottom = top, left = right) {
  return ({ data, width, height }) => {
    const BORDER_CHARACTER = BLACK
    const next_width = width + left + right
    const next_height = height + top + bottom

    const top_rows = range(top).map(() => BORDER_CHARACTER.repeat(next_width))
    const center = chunk(data, width).map((row) => {
      return [BORDER_CHARACTER.repeat(left), row, BORDER_CHARACTER.repeat(right)].join('')
    })
    const bottom_rows = range(bottom).map(() => BORDER_CHARACTER.repeat(next_width))

    return {
      data: [...top_rows, ...center, ...bottom_rows].join(''),
      width: next_width,
      height: next_height,
    }
  }
}

function raw() {
  return ({ data }) => data
}

module.exports = {
  process,
  flatten,
  render,
  scale,
  border,
  raw,
}
