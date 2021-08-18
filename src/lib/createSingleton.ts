export default function createSingleton<T>(name: string, create: () => T): T {
  const s = Symbol.for(name)
  let scope = (global as any)[s]
  if (!scope) {
    scope = { ...create() }
    ;(global as any)[s] = scope
  }
  return scope
}
