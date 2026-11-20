import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'The whole DP table'
export const caption =
  'All 1000 × 1000 cells of L[i][j], the LCS length of the first i letters of s1 and the first j of s2: darker means longer. The pink line is the walk back from the corner that reads off one longest common subsequence.'

export const data = (dir: string) => [...inputText(dir)!.matchAll(/s\d\s*=\s*"([^"]*)"/g)].map((m) => m[1]!)

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'A teljes DP-táblázat',
  caption:
    'Az L[i][j] mind az 1000 × 1000 cellája: az s1 első i és az s2 első j betűjének LCS-hossza; a sötétebb hosszabbat jelent. A rózsaszín vonal a sarokból visszafelé vezető út, amelyről leolvasható egy leghosszabb közös részsorozat.',
}
