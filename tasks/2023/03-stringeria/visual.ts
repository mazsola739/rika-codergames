import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'The whole DP table'
export const caption =
  'All 1000 × 1000 cells of L[i][j], the LCS length of the first i letters of s1 and the first j of s2: darker means longer. The pink line is the walk back from the corner that reads off one longest common subsequence.'

export const data = (dir: string) => [...inputText(dir)!.matchAll(/s\d\s*=\s*"([^"]*)"/g)].map((m) => m[1]!)
