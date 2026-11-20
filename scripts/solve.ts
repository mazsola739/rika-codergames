// Runs one task's solution and prints what it outputs.
// Usage: npm run solve -- 2021/3
import { allTasks, runSolution } from './tasks.ts'

const id = process.argv[2]
const task = allTasks().find((t) => t.id === id)
if (!task) {
  console.error(`Unknown task "${id}". Use <edition>/<number>, for example 2021/3.`)
  process.exit(1)
}
const run = runSolution(task)
process.stdout.write(run.output)
if (run.error) {
  console.error(run.error)
  process.exit(1)
}
console.error(`\n(${Math.round(run.ms)} ms)`)
