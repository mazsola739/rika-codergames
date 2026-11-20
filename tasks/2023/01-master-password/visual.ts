import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'From coordinates to the password'
export const caption =
  'Each {row,col} pair picks a character from the 8 × 8 matrix. The words are then chained: the overlap with the previous word (ignoring case) is dropped, shown struck through.'

export const data = (dir: string) => inputText(dir)!

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'A koordinátáktól a jelszóig',
  caption:
    'Minden {sor,oszlop} pár kiválaszt egy karaktert a 8 × 8-as mátrixból. A szavakat aztán láncba fűzzük: az előző szóval közös átfedés (kis- és nagybetűtől függetlenül) kiesik, ez áthúzva látszik.',
}
