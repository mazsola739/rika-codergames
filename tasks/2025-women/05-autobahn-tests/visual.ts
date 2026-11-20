import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Every test against its speed limit'
export const caption =
  'One lane per road type and weather. Each dot is a test at its speed: filled if the test expects a violation, hollow if not. The bar is the limit; pink dots are the faulty tests whose expectation contradicts it.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.trim().split(';'))

// Hungarian title and caption (docs/hu.html).
export const hu = {
  title: 'Minden teszt a saját sebességhatárához mérve',
  caption:
    'Úttípusonként és időjárásonként egy-egy sáv. Minden pont egy teszt a saját sebességénél: telt, ha a teszt szabálysértést vár, üres, ha nem. A vonal a határ; a rózsaszín pontok a hibás tesztek, amelyek elvárása ellentmond neki.',
}
