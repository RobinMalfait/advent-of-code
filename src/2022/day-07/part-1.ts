export default function (blob: string) {
  let fs = buildFileSystem(blob)

  let SIZE_AT_MOST = 100_000

  return ls(fs)
    .filter((ident) => ident.path !== '/')
    .filter((ident) => ident.size <= SIZE_AT_MOST)
    .map((ident) => ident.size)
    .reduce((total, current) => total + current)
}

type Ident = { type: 'file'; path: string; size: number } | { type: 'dir'; path: string }
function buildFileSystem(data: string) {
  let tree = new Map<string, Ident[]>()
  let pwd = []

  for (let parts of data
    .trim()
    .split('\n')
    .map((line) => line.split(' '))) {
    if (parts[0] === '$') {
      if (parts[1] === 'cd') {
        if (parts[2] === '/') {
          pwd.splice(0)
        } else if (parts[2] === '..') {
          pwd.pop()
        } else {
          pwd.push(parts[2])
        }
      }
    } else {
      let key = `/${pwd.join('/')}`
      let identPath = key === '/' ? key + parts[1] : `${key}/${parts[1]}`
      let ident: Ident =
        parts[0] === 'dir'
          ? { type: 'dir', path: identPath }
          : { type: 'file', path: identPath, size: Number(parts[0]) }
      tree.set(key, [...(tree.get(key) ?? []), ident])
    }
  }

  return tree
}

function ls(tree: ReturnType<typeof buildFileSystem>) {
  return Array.from(tree.keys()).map((path) => ({ path, size: du(tree, path) }))
}

function du(tree: ReturnType<typeof buildFileSystem>, path: string) {
  if (!tree.has(path)) return 0

  return tree
    .get(path)
    .map((ident) => {
      if (ident.type === 'file') return ident.size
      if (ident.type === 'dir') return du(tree, ident.path)
    })
    .reduce((total, current) => total + current)
}
