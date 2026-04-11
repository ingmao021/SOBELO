export function mustInject<T>(value: T | undefined, name: string): T {
  if (!value) {
    throw new Error(`SOBELO context unavailable in ${name}`)
  }

  return value
}
