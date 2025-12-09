import { pairs, Point, Polygon } from 'aoc-utils'

export default function (blob: string) {
  let points = blob.trim().split('\n').map(Point.fromString)

  using outline = Polygon.fromVertices(points)

  let rectangles = pairs(points)
    .map(([a, b]) => Polygon.fromCorners(a, b))
    .toArray()
    .sort((a, z) => z.area() - a.area())

  for (let rectangle of rectangles) {
    if (outline.containsPolygon(rectangle)) {
      return rectangle.area()
    }
  }
}
