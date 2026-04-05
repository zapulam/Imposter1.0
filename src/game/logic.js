export function shuffleIds(ids) {
  const copy = [...ids]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function assignRoles(playerIds, imposterCount) {
  const shuffled = shuffleIds(playerIds)
  const imposters = new Set(shuffled.slice(0, imposterCount))
  const assignments = {}
  for (const id of playerIds) {
    assignments[id] = imposters.has(id) ? 'imposter' : 'normal'
  }
  return assignments
}

export function tallyVotes(votes) {
  const tally = {}
  for (const target of Object.values(votes)) {
    tally[target] = (tally[target] || 0) + 1
  }
  return tally
}

export function topVoteRecipients(tally) {
  const entries = Object.entries(tally)
  if (entries.length === 0) return []
  const max = Math.max(...entries.map(([, c]) => c))
  return entries.filter(([, c]) => c === max).map(([id]) => id)
}

/**
 * @param {object} params
 * @param {Record<string, 'normal'|'imposter'>} params.assignments
 * @param {Record<string, number>} params.tally
 * @param {string[]} params.topVoted
 * @param {'noElimination'|'eliminateAllTied'|'runoff'} params.tieRule
 * @param {boolean} params.isRunoffSecondVote
 */
export function resolveRoundOutcome({
  assignments,
  tally,
  topVoted,
  tieRule,
  isRunoffSecondVote,
}) {
  const isImposter = (id) => assignments[id] === 'imposter'

  if (Object.keys(tally).length === 0) {
    return {
      normalsWin: false,
      reason: 'noVotes',
      eliminatedIds: [],
      topVoted: [],
    }
  }

  if (topVoted.length === 1) {
    const target = topVoted[0]
    return {
      normalsWin: isImposter(target),
      reason: 'singleTarget',
      eliminatedIds: [target],
      topVoted,
    }
  }

  if (tieRule === 'noElimination' || (tieRule === 'runoff' && isRunoffSecondVote)) {
    return {
      normalsWin: false,
      reason: 'tieNoElimination',
      eliminatedIds: [],
      topVoted,
    }
  }

  if (tieRule === 'eliminateAllTied') {
    const eliminated = topVoted
    const allEliminatedAreImposters = eliminated.every((id) => isImposter(id))
    const allImpostersEliminated = Object.entries(assignments)
      .filter(([, r]) => r === 'imposter')
      .every(([id]) => eliminated.includes(id))
    const normalsWin = allEliminatedAreImposters && allImpostersEliminated
    return {
      normalsWin,
      reason: 'eliminateAllTied',
      eliminatedIds: eliminated,
      topVoted,
    }
  }

  return {
    normalsWin: false,
    reason: 'runoffNeeded',
    eliminatedIds: [],
    topVoted,
  }
}

export function normalizeGuess(s) {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

export function guessMatchesWord(guess, word) {
  return normalizeGuess(guess) === normalizeGuess(word)
}
