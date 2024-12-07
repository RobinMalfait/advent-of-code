// Day 8: Space Image Format

import { chunk, range } from '../utils'

const BLACK = '0'
const WHITE = '1'
const TRANSPARENT = '2'

export function process(data, width, height) {
  return Promise.resolve({ data, width, height })
}

export function flatten() {
  return ({ data, width, height }) => {
    let layers = chunk(data, width * height)

    let flattened = layers.reduce(
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

export function render(lookup = PIXELS) {
  return ({ data, width }) => {
    let image_with_pixels = data.split('').map((value) => lookup[value])
    let image = chunk(image_with_pixels.join(''), width).join('\n')
    return `\n${image}\n`
  }
}

export function scale(factorX = 1, factorY = factorX) {
  return ({ data, width, height }) => {
    let next_width = width * factorX
    let next_height = height * factorY

    let canvas = chunk(data, width).map((row) => {
      // Scale the x-axis
      let next_row = row
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

export function border(top = 0, right = top, bottom = top, left = right) {
  return ({ data, width, height }) => {
    let BORDER_CHARACTER = BLACK
    let next_width = width + left + right
    let next_height = height + top + bottom

    let top_rows = range(top).map(() => BORDER_CHARACTER.repeat(next_width))
    let center = chunk(data, width).map((row) => {
      return [BORDER_CHARACTER.repeat(left), row, BORDER_CHARACTER.repeat(right)].join('')
    })
    let bottom_rows = range(bottom).map(() => BORDER_CHARACTER.repeat(next_width))

    return {
      data: [...top_rows, ...center, ...bottom_rows].join(''),
      width: next_width,
      height: next_height,
    }
  }
}

export function raw() {
  return ({ data }) => data
}
