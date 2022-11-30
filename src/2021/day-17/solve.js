export function hits(dx, dy, target) {
  let maxY = 0
  let x = 0
  let y = 0

  while (true) {
    // Velocity
    x += dx
    y += dy

    // Drag
    if (dx > 0) {
      dx -= 1
    } else if (dx < 0) {
      dx += 1
    }

    // Gravity
    dy -= 1

    maxY = Math.max(maxY, y)

    // Hit the target!
    if (target.x1 <= x && x <= target.x2 && target.y1 <= y && y <= target.y2) {
      return { state: 'hit', maxY }
    }

    // Overshot the target
    if (x > target.x2 && y > target.y1) {
      return { state: 'overshot' }
    }

    if (dx === 0 && (target.x1 >= x || x > target.x2)) {
      break
    }

    if (dy < 0 && y < target.y1) {
      break
    }
  }

  return { state: 'miss' }
}

export function range(min, max) {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i)
}
