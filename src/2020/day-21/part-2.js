export default function (blob) {
  let foods = blob
    .trim()
    .split('\n')
    .map((food) => /^(?<ingredients>.*) \(contains (?<allergens>.*)\)$/g.exec(food).groups)
    .map(({ ingredients, allergens }) => [new Set(ingredients.split(' ')), new Set(allergens.split(', '))])

  let byAllergen = new Map()

  for (let [ingredients, allergens] of foods) {
    for (let allergen of allergens) {
      if (!byAllergen.has(allergen)) byAllergen.set(allergen, [])
      byAllergen.get(allergen).push(ingredients)
    }
  }

  let mapped = new Map()

  while (byAllergen.size > 0) {
    for (let [allergen, ingredients] of byAllergen) {
      let leftover = intersect(...ingredients)
      if (leftover.size !== 1) continue

      let ingredient = Array.from(leftover)[0]
      mapped.set(allergen, ingredient)

      for (let food of byAllergen.values()) {
        for (let ingredients of food) ingredients.delete(ingredient)
      }

      byAllergen.delete(allergen)
    }
  }

  return Array.from(mapped.entries())
    .sort((a, z) => a[0].localeCompare(z[0]))
    .map(([, ingredient]) => ingredient)
    .join(',')

  function intersect(...sets) {
    let [first, ...rest] = sets.sort((a, z) => a.size - z.size)
    let intersection = new Set()

    outer: for (let item of first) {
      for (let otherSet of rest) {
        if (!otherSet.has(item)) continue outer
      }

      intersection.add(item)
    }

    return intersection
  }
}
