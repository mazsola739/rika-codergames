import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'The gaps, as a barcode'
export const caption = 'One thin stripe per number from the smallest to the largest value: grey if it is in the array, pink if it is missing.'

export const data = (dir: string) => inputText(dir)!.trim().split(/\s+/).map(Number)
