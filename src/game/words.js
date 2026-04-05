import classicWords from '../data/classicWords.json'
import wordPairs from '../data/wordPairs.json'

export function getClassicWords() {
  return classicWords
}

export function getWordPairs() {
  return wordPairs
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function pickClassicWord(usedKeys) {
  const pool = getClassicWords()
  const keys = pool.map((w, i) => `classic:${i}`)
  const available = keys.map((k, i) => ({ k, i })).filter(({ k }) => !usedKeys.includes(k))
  let choice = available
  if (choice.length === 0) {
    choice = keys.map((k, i) => ({ k, i }))
  }
  shuffleInPlace(choice)
  const { k, i } = choice[0]
  const row = pool[i]
  return {
    wordKey: k,
    category: row.category,
    normalWord: row.word,
    imposterWord: null,
  }
}

export function pickWordPair(usedKeys) {
  const pool = getWordPairs()
  const keys = pool.map((w, i) => `pair:${i}`)
  const available = keys.map((k, i) => ({ k, i })).filter(({ k }) => !usedKeys.includes(k))
  let choice = available
  if (choice.length === 0) {
    choice = keys.map((k, i) => ({ k, i }))
  }
  shuffleInPlace(choice)
  const { k, i } = choice[0]
  const row = pool[i]
  return {
    wordKey: k,
    category: row.category,
    normalWord: row.normalWord,
    imposterWord: row.imposterWord,
  }
}
