// CoderGames 2020, task 3: the fairies' alphabet. The bedtime story is English text where every
// letter was swapped for another one (a monoalphabetic substitution). Break it without knowing
// the key: start from letter frequencies, then hill-climb on "how many real English words do we
// see", swapping two letters at a time, with a few random restarts.
import { readFileSync } from 'node:fs'

const cipher = readFileSync(process.argv[2] ?? 'input.txt', 'utf8').trim()

// The ~300 most common English words. Nothing story-specific, just ordinary vocabulary.
const WORDS = new Set(
  `a about above after again against all am an and any are as at back be because been before being
  below between both but by came can come could day did do does down each even every few first for
  from get give go going good got had has have he her here hers herself him himself his house how
  i if in into is it its itself just know last like little long look made make man many may me
  might more most much must my myself never new no nor not now of off old on once one only or
  other our out over own people said same saw say see she should so some still such take than that
  the their them then there these they thing think this those thought through time to too took two
  under until up upon us very was way we well went were what when where which while who whom why
  will with without would year yet you your again also away began best big called cannot child
  children door eyes face father find found gave girl hand head heard help home keep king left
  let life mother night nothing put ran right room shall side sister soon stood tell told tree
  turned wanted water white wife woman words world young asked another ever full great half let
  near next open place round set small something three till went whole wish beautiful garden dress
  bird daughter son dance danced wedding gold shoe evening morning quite quick question size
  square jump jumped six box`.split(/\s+/),
)

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'
const ENGLISH_BY_FREQUENCY = 'etaoinshrdlcumwfgypbvkjxqz'

// key[c] = plain letter for cipher letter c (both 0..25)
type Key = number[]
const code = (ch: string) => ch.charCodeAt(0) - 97
const lowerCipher = cipher.toLowerCase()
const cipherWords = lowerCipher.match(/[a-z]+/g) ?? []

function decrypt(text: string, key: Key): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const lower = ch.toLowerCase()
    const plain = ALPHABET[key[code(lower)]!]!
    return ch === lower ? plain : plain.toUpperCase()
  })
}

// A tiny model of English: how often each letter follows another inside the common words above
// ('{' marks the start and end of a word), as smoothed log-probabilities. It rewards keys that
// are only partly right, which gives the search something to climb long before whole words appear.
const B = 27
const pairScore = new Float64Array(B * B)
{
  const pairs = new Float64Array(B * B)
  const totals = new Float64Array(B)
  for (const w of WORDS) {
    const s = `{${w}{`
    for (let i = 0; i + 1 < s.length; i++) {
      pairs[code(s[i]!) * B + code(s[i + 1]!)]!++
      totals[code(s[i]!)]!++
    }
  }
  for (let i = 0; i < B * B; i++) pairScore[i] = Math.log((pairs[i]! + 0.5) / (totals[Math.floor(i / B)]! + 0.5 * B))
}

// Each distinct cipher word once, with how many times it occurs.
const distinct = new Map<string, number>()
for (const w of cipherWords) distinct.set(w, (distinct.get(w) ?? 0) + 1)
const wordCodes = [...distinct].map(([w, n]) => ({ codes: [...w].map(code), n }))

// Letter pairs that look English, plus a bonus for every real word.
function score(key: Key): number {
  let s = 0
  for (const { codes, n } of wordCodes) {
    let prev = 26
    let plain = ''
    let ws = 0
    for (const c of codes) {
      const p = key[c]!
      ws += pairScore[prev * B + p]!
      plain += ALPHABET[p]
      prev = p
    }
    ws += pairScore[prev * B + 26]!
    if (WORDS.has(plain)) ws += 3 * plain.length
    s += n * ws
  }
  return s
}

// Swap the plain letters behind two cipher letters as long as some swap improves the score.
function climb(key: Key): [Key, number] {
  let best = score(key)
  for (let improved = true; improved; ) {
    improved = false
    for (let i = 0; i < 26; i++)
      for (let j = i + 1; j < 26; j++) {
        ;[key[i], key[j]] = [key[j]!, key[i]!]
        const s = score(key)
        if (s > best + 1e-9) {
          best = s
          improved = true
        } else [key[i], key[j]] = [key[j]!, key[i]!]
      }
  }
  return [key, best]
}

// Small deterministic random generator, so every run prints the same thing.
let seed = 2020
const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31)
const pick = () => Math.floor(random() * 26)

// Start: the most frequent cipher letter is probably 'e', the next 't', and so on.
const counts = [...ALPHABET].map((c) => [...lowerCipher].filter((x) => x === c).length)
const byFrequency = [...Array(26).keys()].sort((a, b) => counts[b]! - counts[a]! || a - b)
const start: Key = Array(26).fill(0)
byFrequency.forEach((c, rank) => (start[c] = code(ENGLISH_BY_FREQUENCY[rank]!)))

// Climb, then shake the best key a little and climb again, keeping whatever scores highest.
let [bestKey, bestScore] = climb([...start])
for (let restart = 0; restart < 40; restart++) {
  const key = [...bestKey]
  for (let k = 0; k < 3; k++) {
    const i = pick()
    const j = pick()
    ;[key[i], key[j]] = [key[j]!, key[i]!]
  }
  const [k, s] = climb(key)
  if (s > bestScore) [bestKey, bestScore] = [k, s]
}

const plain = decrypt(cipher, bestKey)

// The title: the name that keeps coming back in the story and is not an everyday word.
const names = new Map<string, number>()
for (const w of plain.match(/[A-Za-z]+/g) ?? []) {
  const lower = w.toLowerCase()
  if (w.length >= 5 && !WORDS.has(lower)) names.set(lower, (names.get(lower) ?? 0) + 1)
}
const title = [...names].sort((a, b) => b[1] - a[1])[0]![0]

console.log(title[0]!.toUpperCase() + title.slice(1))
console.log()
console.log(plain)
