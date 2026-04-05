import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_SETTINGS, MIN_PLAYERS } from './game/constants.js'
import {
  assignRoles,
  resolveRoundOutcome,
  shuffleIds,
  tallyVotes,
  topVoteRecipients,
} from './game/logic.js'
import { pickClassicWord, pickWordPair } from './game/words.js'
import { HomeScreen } from './screens/HomeScreen.jsx'
import { RulesScreen } from './screens/RulesScreen.jsx'
import { SetupScreen } from './screens/SetupScreen.jsx'
import { RoleRevealScreen } from './screens/RoleRevealScreen.jsx'
import { ClueTurnScreen } from './screens/ClueTurnScreen.jsx'
import { DiscussionScreen } from './screens/DiscussionScreen.jsx'
import { VotingScreen } from './screens/VotingScreen.jsx'
import { ImposterGuessScreen } from './screens/ImposterGuessScreen.jsx'
import { ResultsScreen } from './screens/ResultsScreen.jsx'

function initialPlayers() {
  return Array.from({ length: 4 }, (_, i) => ({
    id: crypto.randomUUID(),
    name: `Player ${i + 1}`,
  }))
}

function clampImposterCount(requested, playerCount) {
  return Math.max(1, Math.min(requested, Math.max(1, playerCount - 1)))
}

function buildRound(players, settings, usedWordKeys) {
  const imposterCount = clampImposterCount(settings.imposterCount, players.length)
  const picked = settings.mode === 'classic' ? pickClassicWord(usedWordKeys) : pickWordPair(usedWordKeys)
  const assignments = assignRoles(
    players.map((p) => p.id),
    imposterCount,
  )
  const clueOrder = shuffleIds(players.map((p) => p.id))
  return {
    category: picked.category,
    normalWord: picked.normalWord,
    imposterWord: picked.imposterWord,
    assignments,
    wordKey: picked.wordKey,
    revealIndex: 0,
    revealStage: 'pass',
    clueIndex: 0,
    clueOrder,
    discussionEndsAt: null,
    votes: {},
    voteIndex: 0,
    voteStage: 'pass',
    selectedVoteTarget: null,
    isRunoff: false,
    runoffCandidates: null,
    guessContext: null,
    resolvedMeta: null,
  }
}

export default function App() {
  const [phase, setPhase] = useState('home')
  const [players, setPlayers] = useState(initialPlayers)
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS }))
  const [scores, setScores] = useState({})
  const [usedWordKeys, setUsedWordKeys] = useState([])
  const [round, setRound] = useState(null)
  const [setupError, setSetupError] = useState(null)
  const [guessPlayerId, setGuessPlayerId] = useState(null)

  const scoredRoundRef = useRef(null)
  const teamBonusRoundRef = useRef(null)

  const duplicateNameWarning = useMemo(() => {
    const seen = new Set()
    let dup = false
    for (const p of players) {
      const key = p.name.trim().toLowerCase()
      if (!key) continue
      if (seen.has(key)) dup = true
      seen.add(key)
    }
    return dup
  }, [players])

  const updateRound = useCallback((fn) => {
    setRound((r) => (r ? fn(r) : r))
  }, [])

  const startRoundFromSetup = () => {
    if (players.length < MIN_PLAYERS) {
      setSetupError(`Need at least ${MIN_PLAYERS} players.`)
      return
    }
    if (settings.imposterCount < 1 || settings.imposterCount >= players.length) {
      setSetupError('Imposter count must be at least 1 and less than the number of players.')
      return
    }
    if (players.some((p) => !p.name.trim())) {
      setSetupError('Every player needs a name.')
      return
    }
    setSetupError(null)
    const nextRound = buildRound(players, settings, usedWordKeys)
    setUsedWordKeys((prev) => [...prev, nextRound.wordKey])
    setRound(nextRound)
    setPhase('roleReveal')
  }

  const handleVotingComplete = (finalRound) => {
    const tally = tallyVotes(finalRound.votes)
    const top = topVoteRecipients(tally)
    const outcome = resolveRoundOutcome({
      assignments: finalRound.assignments,
      tally,
      topVoted: top,
      tieRule: settings.tieRule,
      isRunoffSecondVote: finalRound.isRunoff,
    })

    if (outcome.reason === 'runoffNeeded') {
      setRound({
        ...finalRound,
        isRunoff: true,
        runoffCandidates: top,
        votes: {},
        voteIndex: 0,
        voteStage: 'pass',
        selectedVoteTarget: null,
      })
      return
    }

    const single = top.length === 1 ? top[0] : null
    const needGuess =
      settings.mode === 'classic' &&
      settings.imposterGuessEnabled &&
      outcome.normalsWin &&
      outcome.reason === 'singleTarget' &&
      single &&
      finalRound.assignments[single] === 'imposter'

    if (needGuess) {
      setRound({
        ...finalRound,
        guessContext: { tally, topVoted: top, outcome },
      })
      setGuessPlayerId(single)
      setPhase('imposterGuess')
      return
    }

    setRound({
      ...finalRound,
      resolvedMeta: {
        tally,
        topVoted: top,
        outcome,
        displayNormalsWin: outcome.normalsWin,
        guessStoleWin: false,
      },
    })
    setPhase('results')
  }

  const handleGuessComplete = (correct) => {
    setRound((r) => {
      const ctx = r.guessContext
      return {
        ...r,
        guessContext: null,
        resolvedMeta: {
          tally: ctx.tally,
          topVoted: ctx.topVoted,
          outcome: ctx.outcome,
          displayNormalsWin: correct ? false : ctx.outcome.normalsWin,
          guessStoleWin: correct,
        },
      }
    })
    setGuessPlayerId(null)
    setPhase('results')
  }

  useEffect(() => {
    if (phase !== 'results' || !round?.resolvedMeta || !settings.scoringEnabled) return
    if (scoredRoundRef.current === round.wordKey) return
    scoredRoundRef.current = round.wordKey

    setScores((prev) => {
      const next = { ...prev }
      for (const p of players) {
        if (next[p.id] == null) next[p.id] = 0
      }
      const isImp = (id) => round.assignments[id] === 'imposter'
      const meta = round.resolvedMeta
      if (meta.guessStoleWin) {
        for (const p of players) {
          if (isImp(p.id)) next[p.id] += 2
        }
        return next
      }
      if (meta.displayNormalsWin) {
        for (const p of players) {
          if (!isImp(p.id)) next[p.id] += 1
        }
      } else {
        for (const p of players) {
          if (isImp(p.id)) next[p.id] += 2
        }
      }
      return next
    })
  }, [phase, round, players, settings.scoringEnabled])

  const handleTeamBonus = useCallback(() => {
    if (!round || !settings.scoringEnabled || settings.mode !== 'multiWord') return
    if (teamBonusRoundRef.current === round.wordKey) return
    teamBonusRoundRef.current = round.wordKey
    setScores((prev) => {
      const next = { ...prev }
      for (const p of players) {
        if (next[p.id] == null) next[p.id] = 0
        if (round.assignments[p.id] === 'imposter') next[p.id] += 1
      }
      return next
    })
  }, [round, players, settings])

  const goNextRound = () => {
    const nextRound = buildRound(players, settings, usedWordKeys)
    setUsedWordKeys((prev) => [...prev, nextRound.wordKey])
    setRound(nextRound)
    setPhase('roleReveal')
  }

  const goHome = () => {
    setPhase('home')
    setRound(null)
    setGuessPlayerId(null)
    setUsedWordKeys([])
    scoredRoundRef.current = null
    teamBonusRoundRef.current = null
  }

  if (phase === 'home') {
    return <HomeScreen onStart={() => setPhase('setup')} onRules={() => setPhase('rules')} />
  }

  if (phase === 'rules') {
    return <RulesScreen onBack={() => setPhase('home')} />
  }

  if (phase === 'setup') {
    return (
      <SetupScreen
        players={players}
        onPlayersChange={setPlayers}
        settings={settings}
        onSettingsChange={setSettings}
        onBack={() => setPhase('home')}
        onStart={startRoundFromSetup}
        duplicateNameWarning={duplicateNameWarning}
        setupError={setupError}
      />
    )
  }

  if (!round) {
    return <HomeScreen onStart={() => setPhase('setup')} onRules={() => setPhase('rules')} />
  }

  if (phase === 'imposterGuess' && guessPlayerId) {
    const gp = players.find((p) => p.id === guessPlayerId)
    if (!gp) {
      setPhase('results')
      return null
    }
    return <ImposterGuessScreen guessPlayer={gp} round={round} onComplete={handleGuessComplete} />
  }

  if (phase === 'roleReveal') {
    return (
      <RoleRevealScreen
        players={players}
        round={round}
        settings={settings}
        onUpdateRound={updateRound}
        onRevealDone={() => setPhase('clues')}
      />
    )
  }

  if (phase === 'clues') {
    return (
      <ClueTurnScreen
        players={players}
        round={round}
        onUpdateRound={updateRound}
        onCluesDone={() => setPhase('discussion')}
      />
    )
  }

  if (phase === 'discussion') {
    return (
      <DiscussionScreen
        settings={settings}
        round={round}
        onUpdateRound={updateRound}
        onDiscussionDone={() => setPhase('voting')}
      />
    )
  }

  if (phase === 'voting') {
    return (
      <VotingScreen
        players={players}
        settings={settings}
        round={round}
        onUpdateRound={updateRound}
        onVotingComplete={handleVotingComplete}
      />
    )
  }

  if (phase === 'results' && round.resolvedMeta) {
    return (
      <ResultsScreen
        players={players}
        settings={settings}
        round={round}
        scores={scores}
        onNextRound={goNextRound}
        onHome={goHome}
        onTeamBonus={handleTeamBonus}
      />
    )
  }

  return <HomeScreen onStart={() => setPhase('setup')} onRules={() => setPhase('rules')} />
}
