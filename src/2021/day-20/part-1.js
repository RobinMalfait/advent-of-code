let LIGHT = '#'
let DARK = '.'

export default function (blob, steps = 2) {
  let [imageEnhancementAlgorithm, inputImage] = blob.trim().split('\n\n')
  inputImage = inputImage.split('\n').map((row) => row.split(''))

  let lights = new Set()

  // Initial state
  for (let y = 0; y < inputImage.length; y++) {
    for (let x = 0; x < inputImage[y].length; x++) {
      if (inputImage[y][x] === LIGHT) {
        lights.add(id(y, x))
      }
    }
  }

  // Step by step
  for (let step = 0; step < steps; step++) {
    // First character in the imageEnhancementAlgorithm is a # which means that
    // if you have nothingness you will end up with 00000000 which si the first
    // item which will make it light up — to infinity 😱
    let flip = step % 2 === 0
    let expect = flip ? DARK : LIGHT

    let newLights = new Set()

    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity

    for (let light of lights) {
      let [y, x] = fromId(light)
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }

    // Expand to the top and bottom
    for (let y of range(minY - 1, maxY + 1)) {
      // Expand to the left and right
      for (let x of range(minX - 1, maxX + 1)) {
        let binary = ''

        // Build binary string based on neighbours
        for (let dy of [-1, 0, 1]) {
          for (let dx of [-1, 0, 1]) {
            binary += lights.has(id(y + dy, x + dx)) === flip ? '1' : '0'
          }
        }

        if (imageEnhancementAlgorithm[parseInt(binary, 2)] === expect) {
          newLights.add(id(y, x))
        }
      }
    }

    lights = newLights
  }

  return lights.size
}

function debug(lights) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (let light of lights) {
    let [y, x] = fromId(light)
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
  }

  let output = []
  for (let y of range(minY - 0, maxY + 0)) {
    let row = ''
    for (let x of range(minX - 0, maxX + 0)) {
      row += lights.has(id(y, x)) ? LIGHT : DARK
    }
    output.push(row)
  }
  console.log(output.join('\n'))
}

// Sigh... I want tuples and records!
function id(y, x) {
  return `${y},${x}`
}

function fromId(id) {
  return id.split(',').map(Number)
}

function range(min, max) {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}
