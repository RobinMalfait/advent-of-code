export function* windows<T>(input: T[], size: number) {
  for (let i = 0; i <= input.length - size; i++) {
    yield input.slice(i, i + size)
  }
}
