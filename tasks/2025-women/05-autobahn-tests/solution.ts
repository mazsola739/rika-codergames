// CoderGames for Women 2025, task 5: find the unit tests whose VIOLATION flag is wrong.
// Look up the speed limit for the road type and weather (no limit on a clear highway), decide
// whether the recorded speed is over it, and report every test whose flag says otherwise.
import { readFileSync } from 'node:fs'

const LIMITS: Record<string, Record<string, number>> = {
  CITY: { CLEAR: 50, RAIN: 40, FOG: 30 },
  RURAL: { CLEAR: 100, RAIN: 80, FOG: 60 },
  HIGHWAY: { CLEAR: Infinity, RAIN: 130, FOG: 100 },
}

const faulty: string[] = []
for (const line of readFileSync(process.argv[2] ?? 'input.txt', 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue
  const [id, speed, road, weather, flag] = line.trim().split(';') as [string, string, string, string, string]
  const limit = LIMITS[road]?.[weather]
  if (limit === undefined) throw new Error(`unknown road or weather in ${line}`)
  const speeding = Number(speed) > limit
  if (speeding !== (flag === 'TRUE')) faulty.push(id)
}
console.log(faulty.join('\n'))
