import { inputText } from '../../../scripts/visual-helpers.ts'

export const title = 'Vanish, spell, explore'
export const caption =
  'The two example mansions step by step: find the entrance (no passage leads in), remove the vanished rooms, apply the spell once, then explore from the entrance. Below: the four possible entrances of the real 20,000-room mansion.'

export function data(dir: string) {
  // The real mansion is too big to draw; summarise its four candidate entrances instead
  // (the numbers are the solution's verified output).
  const lines = inputText(dir)!.split('\n').map((l) => l.trim()).filter(Boolean)
  const n = Number(lines[0])
  return {
    examples: [
      { rooms: ['1,2,3', '3,4', '2,3', '4'], vanished: [3] },
      { rooms: ['4,1,5', '2', '5', '6,2', '3,4,6', '1'], vanished: [1, 5] },
    ],
    real: { rooms: n, entrances: [6496, 7741, 15415, 16841], reachable: [19953, 19950, 1348, 19952], extra: 9 },
  }
}
