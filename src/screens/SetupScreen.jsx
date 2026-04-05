import { AlertTriangle, ArrowLeft } from 'lucide-react'
import { MAX_PLAYERS, MIN_PLAYERS } from '../game/constants.js'
import { PrimaryButton, ScreenShell, SecondaryButton } from '../components/ScreenShell.jsx'

function imposterRecommendation(n) {
  if (n <= 5) return 'Usually 1 Imposter.'
  if (n <= 8) return 'Often 1–2 Imposters.'
  return 'Often 2–3 Imposters.'
}

export function SetupScreen({
  players,
  onPlayersChange,
  settings,
  onSettingsChange,
  onBack,
  onStart,
  duplicateNameWarning,
  setupError,
}) {
  const n = players.length
  const balanceHint = imposterRecommendation(n)
  const imposterTooHigh = settings.imposterCount >= n
  const tooFewPlayers = n < MIN_PLAYERS

  const setName = (id, name) => {
    onPlayersChange(players.map((p) => (p.id === id ? { ...p, name } : p)))
  }

  const addPlayer = () => {
    if (players.length >= MAX_PLAYERS) return
    const nextNum = players.length + 1
    onPlayersChange([...players, { id: crypto.randomUUID(), name: `Player ${nextNum}` }])
  }

  const removePlayer = (id) => {
    if (players.length <= MIN_PLAYERS) return
    onPlayersChange(players.filter((p) => p.id !== id))
  }

  return (
    <ScreenShell
      title="Game setup"
      headerRight={
        <SecondaryButton className="!w-auto !min-h-10 px-3 py-2 text-sm" onClick={onBack}>
          <span className="inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Home
          </span>
        </SecondaryButton>
      }
      footer={<PrimaryButton onClick={onStart}>Start round</PrimaryButton>}
    >
      <div className="max-w-md mx-auto w-full flex flex-col gap-5 pb-4">
        {setupError ? (
          <p className="text-danger text-sm rounded-lg bg-red-950/40 border border-red-900/60 px-3 py-2">{setupError}</p>
        ) : null}
        {duplicateNameWarning ? (
          <p className="text-warn text-sm inline-flex items-start gap-2 rounded-lg bg-amber-950/30 border border-amber-900/50 px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden />
            <span>Some names match. Play is fine, but nicknames help avoid confusion.</span>
          </p>
        ) : null}

        <section className="space-y-2">
          <h2 className="text-white font-semibold text-sm">Players ({MIN_PLAYERS}–{MAX_PLAYERS})</h2>
          <div className="flex flex-col gap-2">
            {players.map((p) => (
              <div key={p.id} className="flex gap-2 items-center">
                <input
                  className="flex-1 min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white placeholder:text-slate-500"
                  value={p.name}
                  onChange={(e) => setName(p.id, e.target.value)}
                  placeholder="Name"
                  autoComplete="off"
                  autoCapitalize="words"
                />
                <button
                  type="button"
                  className="min-h-12 min-w-12 rounded-xl border border-surface-600 text-slate-300 disabled:opacity-30"
                  onClick={() => removePlayer(p.id)}
                  disabled={players.length <= MIN_PLAYERS}
                  aria-label="Remove player"
                >
                  −
                </button>
              </div>
            ))}
          </div>
          <SecondaryButton className="!min-h-11 text-sm" onClick={addPlayer} disabled={players.length >= MAX_PLAYERS}>
            Add player
          </SecondaryButton>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-semibold text-sm">Game mode</h2>
          <select
            className="w-full min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white"
            value={settings.mode}
            onChange={(e) => onSettingsChange({ ...settings, mode: e.target.value })}
          >
            <option value="classic">Classic</option>
            <option value="multiWord">Multi-word Imposter</option>
          </select>
          {settings.mode === 'classic' ? (
            <label className="flex flex-col gap-1 text-sm text-slate-300">
              <span>Imposter hint</span>
              <select
                className="w-full min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white"
                value={settings.classicImposterHint}
                onChange={(e) => onSettingsChange({ ...settings, classicImposterHint: e.target.value })}
              >
                <option value="none">No hint (only “You are an Imposter”)</option>
                <option value="category">Category hint only</option>
              </select>
            </label>
          ) : null}
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-semibold text-sm">Imposters</h2>
          <p className="text-xs text-slate-400">{balanceHint}</p>
          <input
            type="number"
            min={1}
            max={Math.max(1, n - 1)}
            className="w-full min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white"
            value={settings.imposterCount}
            onChange={(e) => onSettingsChange({ ...settings, imposterCount: Number(e.target.value) })}
          />
          {imposterTooHigh ? (
            <p className="text-danger text-xs">Imposter count must be less than the number of players.</p>
          ) : null}
          {tooFewPlayers ? (
            <p className="text-warn text-xs">Add more players to start (minimum {MIN_PLAYERS}).</p>
          ) : null}
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-semibold text-sm">Discussion timer</h2>
          <select
            className="w-full min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white"
            value={String(settings.discussionTimer)}
            onChange={(e) => {
              const v = e.target.value
              onSettingsChange({
                ...settings,
                discussionTimer: v === 'off' ? 'off' : Number(v),
              })
            }}
          >
            <option value="off">Off (free discussion)</option>
            <option value="30">30 seconds</option>
            <option value="60">60 seconds</option>
            <option value="90">90 seconds</option>
          </select>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-semibold text-sm">Voting</h2>
          <label className="flex items-center gap-3 text-sm text-slate-200 min-h-12">
            <input
              type="checkbox"
              className="w-5 h-5 accent-accent"
              checked={settings.allowSelfVote}
              onChange={(e) => onSettingsChange({ ...settings, allowSelfVote: e.target.checked })}
            />
            Allow voting for yourself
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-300">
            <span>If votes tie for first place</span>
            <select
              className="w-full min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white"
              value={settings.tieRule}
              onChange={(e) => onSettingsChange({ ...settings, tieRule: e.target.value })}
            >
              <option value="noElimination">No elimination (Imposters win the vote)</option>
              <option value="eliminateAllTied">Eliminate everyone tied for most votes</option>
              <option value="runoff">Runoff: vote again among tied players</option>
            </select>
          </label>
        </section>

        <section className="space-y-2">
          <h2 className="text-white font-semibold text-sm">Scoring and extras</h2>
          <label className="flex items-center gap-3 text-sm text-slate-200 min-h-12">
            <input
              type="checkbox"
              className="w-5 h-5 accent-accent"
              checked={settings.scoringEnabled}
              onChange={(e) => onSettingsChange({ ...settings, scoringEnabled: e.target.checked })}
            />
            Keep score across rounds
          </label>
          {settings.mode === 'classic' ? (
            <label className="flex items-center gap-3 text-sm text-slate-200 min-h-12">
              <input
                type="checkbox"
                className="w-5 h-5 accent-accent"
                checked={settings.imposterGuessEnabled}
                onChange={(e) => onSettingsChange({ ...settings, imposterGuessEnabled: e.target.checked })}
              />
              Caught Imposter may guess the word (steal win)
            </label>
          ) : null}
        </section>
      </div>
    </ScreenShell>
  )
}
