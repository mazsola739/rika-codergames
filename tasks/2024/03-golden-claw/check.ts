// Many answers are correct (+3 and -1 are the same turn on a 4-faced pillar), so instead of
// comparing with the official list, replay every manual turn exactly as the story describes it
// (a turned pillar turns both pillars below it, which turn the ones below them, ...) and check
// that the pyramid ends up matching the sketch.
export default function check(output: string, ctx: { input: string | null }): string | null {
  const lines = (ctx.input ?? '').split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0)
  const answers = output.trim().split(/\r?\n/)
  for (let c = 0; c * 3 + 2 < lines.length; c++) {
    const m = Number(lines[c * 3])
    const faces = lines[c * 3 + 1]!.split(/\s+/).map(Number)
    const target = lines[c * 3 + 2]!.split(/\s+/).map(Number)
    const turns = (answers[c] ?? '').replace(/[[\]]/g, '').split(',').map(Number)
    if (turns.length !== faces.length) return `case ${c + 1}: ${turns.length} turns for ${faces.length} pillars`
    const rowStart = (row: number) => (row * (row + 1)) / 2
    const rows = Math.round((Math.sqrt(8 * faces.length + 1) - 1) / 2)
    const turn = (row: number, j: number, x: number): void => {
      if (row >= rows) return
      const i = rowStart(row) + j
      faces[i] = (((faces[i]! + x) % m) + m) % m
      turn(row + 1, j, x)
      turn(row + 1, j + 1, x)
    }
    for (let row = 0; row < rows; row++)
      for (let j = 0; j <= row; j++) if (turns[rowStart(row) + j]) turn(row, j, turns[rowStart(row) + j]!)
    const bad = faces.findIndex((f, i) => f !== ((target[i]! % m) + m) % m)
    if (bad >= 0) return `case ${c + 1}: pillar ${bad + 1} shows ${faces[bad]}, the sketch wants ${target[bad]}`
  }
  return null
}
