export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => {
      let [, name, sectorId, checksum] = /(.*?)-(\d+)\[(.*?)\]/.exec(line.trim())
      return { name, sectorId: Number(sectorId), checksum }
    })
    .filter((room) => {
      let counts = new Map()
      for (let c of room.name) {
        if (c === '-') continue
        counts.set(c, (counts.get(c) || 0) + 1)
      }

      return (
        Array.from(counts.entries())
          .sort((a, z) => z[1] - a[1] || a[0].localeCompare(z[0]))
          .slice(0, 5)
          .map(([x]) => x)
          .join('') === room.checksum
      )
    })
    .map((room) => room.sectorId)
    .reduce((a, b) => a + b, 0)
    .toString()
}
