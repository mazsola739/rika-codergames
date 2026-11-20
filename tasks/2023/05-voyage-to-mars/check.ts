// The published answer is not a valid packing: it lists machines 5996 and 9777 twice (see
// README.md). So the check recomputes everything from the input instead: the machines must exist,
// be distinct and fit, the printed totals must be right, and the value must reach the optimum
// (743529.6098448576, proven by branch and bound and only 4.2 below the fractional upper bound).
const OPTIMUM = 743529.6098448576

export default function check(output: string, ctx: { input: string | null }): string | null {
  const data: { items: { id: number; value: number; weight: number }[]; capacity: number } = JSON.parse(ctx.input ?? '{}')
  const byId = new Map(data.items.map((it) => [it.id, it]))
  const ids = (output.split('items:')[1] ?? '').trim().split(/\s+/).map(Number)
  if (new Set(ids).size !== ids.length) return 'a machine is packed twice'
  let value = 0
  let weight = 0
  for (const id of ids) {
    const it = byId.get(id)
    if (!it) return `there is no machine ${id}`
    value += it.value
    weight += it.weight
  }
  if (weight > data.capacity + 1e-9) return `the packing weighs ${weight}, over ${data.capacity}`
  const printed = Number(output.match(/Total value:\s*(\S+)/)?.[1])
  if (Math.abs(printed - value) > 1e-6) return `prints value ${printed}, but the machines add up to ${value}`
  if (value < OPTIMUM - 1e-6) return `value ${value} is below the optimum ${OPTIMUM}`
  return null
}
