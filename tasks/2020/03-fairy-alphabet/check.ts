// First line: the title. The rest must be the text exactly as the organisers' own key decrypts it
// (their solution published the key: plain a..z was written as the letters below).
import { normalize } from '../../../scripts/tasks.ts'

const OFFICIAL_KEY = 'nzghqkcdmyfoialxevtswrupjb'

function decrypt(text: string): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const plain = String.fromCharCode(97 + OFFICIAL_KEY.indexOf(ch.toLowerCase()))
    return ch === ch.toLowerCase() ? plain : plain.toUpperCase()
  })
}

export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const [title, , ...text] = normalize(output).split('\n')
  if (title !== normalize(ctx.answer ?? '')) return `expected the title ${ctx.answer?.trim()}, got ${title}`
  if (text.join('\n') !== normalize(decrypt(ctx.input ?? ''))) return 'the decrypted text differs from the official key'
  return null
}
