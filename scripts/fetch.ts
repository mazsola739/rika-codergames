// Downloads the inputs that are too large to keep in git (task.json "fetch").
import { existsSync, writeFileSync } from 'node:fs'
import { allTasks, inputPath } from './tasks.ts'

for (const t of allTasks()) {
  const path = inputPath(t)
  if (!t.fetch || !path) continue
  if (existsSync(path)) {
    console.log(`${t.id}: already there`)
    continue
  }
  console.log(`${t.id}: downloading ${t.fetch}`)
  const res = await fetch(t.fetch)
  if (!res.ok) {
    console.error(`${t.id}: HTTP ${res.status}`)
    process.exitCode = 1
    continue
  }
  const body = Buffer.from(await res.arrayBuffer())
  writeFileSync(path, body)
  console.log(`${t.id}: saved ${(body.length / 1e6).toFixed(1)} MB`)
}
