// The official answer gives the decrypted text (and the title, which a human has to recognise).
// The program prints the decrypted text first and the key it found second.
import { normalize } from '../../../scripts/tasks.ts'

export default function check(output: string, { answer }: { answer: string | null }): string | null {
  const [text, key] = normalize(output).split('\n')
  if (text !== normalize(answer ?? '')) return 'the decrypted text differs from the official one'
  if (!key?.startsWith('Key: ')) return 'the key is missing'
  return null
}
