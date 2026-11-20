// Many different subsequences can share the maximum length, so the official string is just one
// of them. Accept any common subsequence of both strings with the official length.
export default function check(output: string, ctx: { input: string | null; answer: string | null }): string | null {
  const [s1, s2] = [...(ctx.input ?? '').matchAll(/s\d\s*=\s*"([^"]*)"/g)].map((m) => m[1]!)
  const lcs = output.match(/Longest Common Subsequence:\s*(\S*)/)?.[1] ?? ''
  const length = Number(output.match(/Length:\s*(\d+)/)?.[1])
  const want = Number((ctx.answer ?? '').match(/Length:\s*(\d+)/)?.[1])
  const isSubsequence = (sub: string, s: string) => {
    let i = 0
    for (const ch of s) if (ch === sub[i]) i++
    return i === sub.length
  }
  if (!isSubsequence(lcs, s1!) || !isSubsequence(lcs, s2!)) return 'not a common subsequence of s1 and s2'
  if (lcs.length !== length) return `the printed length ${length} is not the string's length ${lcs.length}`
  if (length !== want) return `expected length ${want}, got ${length}`
  return null
}
