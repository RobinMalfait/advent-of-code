export default function (blob: string) {
  return blob
    .trim()
    .split('\n')
    .map((line) => {
      let [, name, sectorId] = /(.*?)-(\d+)/.exec(line.trim())
      return { name, sectorId: Number(sectorId) }
    })
    .find((room) => {
      let offset = room.sectorId % 26
      return (
        room.name
          .split('')
          .map((c) => {
            if (c === '-') return ' '
            return String.fromCharCode(((c.charCodeAt(0) - 97 + offset) % 26) + 97)
          })
          .join('') === 'northpole object storage'
      )
    })?.sectorId
}
