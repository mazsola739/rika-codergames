import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Every test against its speed limit'
export const caption =
  'One lane per road type and weather. Each dot is a test at its speed: filled if the test expects a violation, hollow if not. The bar is the limit; pink dots are the faulty tests whose expectation contradicts it.'

export const data = (dir: string) =>
  inputText(dir)!
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => l.trim().split(';'))
