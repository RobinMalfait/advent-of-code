export default function (blob: string, amount = 4) {
  return (
    blob
      .split('')
      .map((_, i, all) => all.slice(i, i + amount))
      .findIndex((x) => new Set(x).size === amount) + amount
  )
}
