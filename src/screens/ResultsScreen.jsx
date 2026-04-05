import { useState } from 'react'
import { PrimaryButton, ScreenShell, SecondaryButton } from '../components/ScreenShell.jsx'

export function ResultsScreen({ players, settings, round, scores, onNextRound, onHome, onTeamBonus }) {
  const meta = round.resolvedMeta
  const tally = meta.tally
  const topVoted = meta.topVoted
  const displayNormalsWin = meta.displayNormalsWin
  const guessStoleWin = meta.guessStoleWin

  const [teamBonusLocked, setTeamBonusLocked] = useState(false)

  const headline = guessStoleWin
    ? 'Imposters steal the win!'
    : displayNormalsWin
      ? 'Crew wins the vote'
      : 'Imposters win the vote'

  const subtext = (() => {
    if (guessStoleWin) return 'The voted-out Imposter guessed the crew word correctly.'
    if (meta.outcome.reason === 'tieNoElimination') return 'Top votes tied—no elimination. Imposters take the round.'
    if (meta.outcome.reason === 'eliminateAllTied') {
      return displayNormalsWin
        ? 'Everyone tied for first was an Imposter. Crew cleans house.'
        : 'The tie included an innocent—or not every Imposter was caught.'
    }
    if (meta.outcome.reason === 'noVotes') return 'No votes recorded.'
    return null
  })()

  const sortedPlayers = [...players].sort((a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0))

  return (
    <ScreenShell
      title="Results"
      footer={
        <div className="flex flex-col gap-2">
          {settings.mode === 'multiWord' && settings.scoringEnabled ? (
            <label className="flex items-center gap-3 text-sm text-slate-200 min-h-12 px-1">
              <input
                type="checkbox"
                className="w-5 h-5 accent-accent"
                disabled={teamBonusLocked}
                onChange={(e) => {
                  if (!e.target.checked) return
                  setTeamBonusLocked(true)
                  onTeamBonus?.()
                }}
              />
              Imposters spotted each other (+1 each)
            </label>
          ) : null}
          <PrimaryButton onClick={onNextRound}>Next round</PrimaryButton>
          <SecondaryButton onClick={onHome}>Home</SecondaryButton>
        </div>
      }
    >
      <div className="max-w-md mx-auto w-full flex flex-col gap-5 pb-4">
        <div className="rounded-2xl border border-surface-600 bg-surface-800 p-4 text-center space-y-2">
          <p className={`text-xl font-bold ${displayNormalsWin && !guessStoleWin ? 'text-accent' : 'text-danger'}`}>
            {headline}
          </p>
          {subtext ? <p className="text-slate-400 text-sm">{subtext}</p> : null}
        </div>

        <section>
          <h2 className="text-white font-semibold text-sm mb-2">Votes</h2>
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id} className="flex justify-between text-slate-200 text-sm">
                <span>{p.name}</span>
                <span className="text-slate-400">{tally[p.id] ?? 0}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-500 mt-2">
            Top vote{topVoted.length !== 1 ? 's' : ''}:{' '}
            {topVoted.length
              ? topVoted.map((id) => players.find((p) => p.id === id)?.name).join(', ')
              : '—'}
          </p>
        </section>

        <section>
          <h2 className="text-white font-semibold text-sm mb-2">Words</h2>
          <p className="text-slate-300 text-sm">Category: {round.category}</p>
          <p className="text-white">Crew word: {round.normalWord}</p>
          {settings.mode === 'multiWord' && round.imposterWord ? (
            <p className="text-white">Imposter word: {round.imposterWord}</p>
          ) : null}
        </section>

        <section>
          <h2 className="text-white font-semibold text-sm mb-2">Roles</h2>
          <ul className="space-y-2">
            {players.map((p) => (
              <li key={p.id} className="flex justify-between text-sm">
                <span className="text-slate-200">{p.name}</span>
                <span className={round.assignments[p.id] === 'imposter' ? 'text-danger' : 'text-accent'}>
                  {round.assignments[p.id] === 'imposter' ? 'Imposter' : 'Crew'}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {settings.scoringEnabled ? (
          <section>
            <h2 className="text-white font-semibold text-sm mb-2">Scoreboard</h2>
            <ul className="space-y-2">
              {sortedPlayers.map((p) => (
                <li key={p.id} className="flex justify-between text-sm text-slate-200">
                  <span>{p.name}</span>
                  <span className="text-slate-400">{scores[p.id] ?? 0}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </ScreenShell>
  )
}
