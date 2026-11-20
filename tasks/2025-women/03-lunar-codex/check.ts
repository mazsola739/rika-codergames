// The official answer is the decrypted poem (quotes and spacing differ slightly), so compare the
// letters only. The keys come first in the output, separated from the poem by a blank line.
import { normalize } from '../../../scripts/tasks.ts'

const letters = (s: string) => s.replace(/[^A-Za-z]/g, '')

export default function check(output: string, { answer }: { answer: string | null }): string | null {
  const [keys, poem] = normalize(output).split(/\n\s*\n/)
  if (!keys || !/^\d+(\n\d+)*$/.test(keys)) return 'the keys are missing'
  if (letters(poem ?? '') !== letters(answer ?? '')) return 'the decrypted poem differs from the official one'
  return null
}
