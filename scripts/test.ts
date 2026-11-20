// Runs every solution on its input and checks the output against the official answer.
// Usage: npm test            all tasks
//        npm test -- 2021    one edition
//        npm test -- 2021/3  one task
import { existsSync } from 'node:fs'
import { allTasks, runSolution, check, inputPath } from './tasks.ts'

const filters = process.argv.slice(2)
const tasks = allTasks().filter(
  (t) => filters.length === 0 || filters.some((f) => t.id === f || t.edition.id === f),
)

let passed = 0
let failed = 0
let skipped = 0

for (const t of tasks) {
  const label = `${t.id.padEnd(12)} ${t.title}`
  if (t.status === 'pending') {
    console.log(`  -   ${label}  (not published yet)`)
    skipped++
    continue
  }
  const input = inputPath(t)
  if (input && !existsSync(input)) {
    console.log(`  -   ${label}  (input missing, run: npm run fetch)`)
    skipped++
    continue
  }
  const run = runSolution(t)
  const problem = run.error ?? (await check(t, run.output))
  const time = `${Math.round(run.ms)} ms`.padStart(8)
  if (problem) {
    console.log(`FAIL  ${label}  ${time}\n      ${problem.split('\n').join('\n      ')}`)
    failed++
  } else {
    console.log(` ok   ${label}  ${time}`)
    passed++
  }
}

console.log(`\n${passed} passed, ${failed} failed, ${skipped} skipped`)
process.exit(failed ? 1 : 0)
