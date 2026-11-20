// Any path works as long as it uses real trails, never repeats a point and is as long as the
// official one (which visits all 100 points, so it can't be beaten).
export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const edges = new Set<string>()
  for (const [, a, b] of (ctx.input ?? '').matchAll(/\{\s*(\d+)\s*,\s*(\d+)\s*[}\)]/g)) edges.add(`${a}-${b}`).add(`${b}-${a}`)
  const want = Number((ctx.answer ?? '').match(/Number of visited nodes:\s*(\d+)/)?.[1])
  const count = Number(output.match(/Number of visited nodes:\s*(\d+)/)?.[1])
  const steps = [...output.matchAll(/\((\d+), (\d+)\)/g)].map(([, a, b]) => [Number(a), Number(b)] as const)
  const nodes = [steps[0]![0], ...steps.map(([, b]) => b)]
  for (let i = 0; i < steps.length; i++) {
    const [a, b] = steps[i]!
    if (!edges.has(`${a}-${b}`)) return `(${a}, ${b}) is not a trail`
    if (i > 0 && steps[i - 1]![1] !== a) return `the path breaks at (${a}, ${b})`
  }
  if (new Set(nodes).size !== nodes.length) return 'a point is visited twice'
  if (nodes.length !== count) return `prints ${count} nodes but the path has ${nodes.length}`
  if (count !== want) return `expected ${want} nodes, got ${count}`
  return null
}
