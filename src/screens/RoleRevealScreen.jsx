import { Eye, EyeOff } from 'lucide-react'
import { PrimaryButton, ScreenShell, SecondaryButton } from '../components/ScreenShell.jsx'

function RoleCard({ children }) {
  return (
    <div className="rounded-2xl border border-surface-600 bg-surface-800 p-6 text-center space-y-3">
      {children}
    </div>
  )
}

export function RoleRevealScreen({ players, round, settings, onUpdateRound, onRevealDone }) {
  const player = players[round.revealIndex]
  const role = round.assignments[player.id]
  const stage = round.revealStage

  const goShow = () => onUpdateRound((r) => ({ ...r, revealStage: 'show' }))
  const goHide = () => {
    const nextIndex = round.revealIndex + 1
    if (nextIndex >= players.length) {
      onRevealDone()
      return
    }
    onUpdateRound((r) => ({ ...r, revealIndex: nextIndex, revealStage: 'pass' }))
  }

  return (
    <ScreenShell title="Secret roles" footer={null}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center gap-6">
        {stage === 'pass' ? (
          <>
            <p className="text-center text-slate-300 text-lg">Pass the device to</p>
            <p className="text-center text-white text-3xl font-bold">{player.name}</p>
            <p className="text-center text-slate-400 text-sm">When you are alone with the phone, continue.</p>
            <PrimaryButton onClick={goShow}>Ready</PrimaryButton>
          </>
        ) : (
          <>
            <p className="text-center text-warn text-sm font-medium inline-flex items-center justify-center gap-2">
              <EyeOff className="w-4 h-4" aria-hidden />
              Do not let anyone else see this screen
            </p>
            <RoleCard>
              <p className="text-slate-400 text-sm">{player.name}</p>
              {role === 'normal' ? (
                <>
                  <p className="text-accent text-sm font-semibold uppercase tracking-wide">Crew</p>
                  <p className="text-white text-2xl font-bold">{round.normalWord}</p>
                  <p className="text-slate-400 text-sm">Category: {round.category}</p>
                  {settings.mode === 'multiWord' ? (
                    <p className="text-slate-500 text-xs">Everyone on the crew shares this word.</p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="text-danger text-sm font-semibold uppercase tracking-wide">Imposter</p>
                  {settings.mode === 'multiWord' ? (
                    <>
                      <p className="text-white text-2xl font-bold">{round.imposterWord}</p>
                      <p className="text-slate-400 text-sm">Category: {round.category}</p>
                      <p className="text-slate-500 text-xs">
                        You have a different word than the crew. Blend in and watch for allies.
                      </p>
                    </>
                  ) : settings.classicImposterHint === 'category' ? (
                    <>
                      <p className="text-white text-xl">You do not know the secret word.</p>
                      <p className="text-slate-300 text-lg">Category: {round.category}</p>
                    </>
                  ) : (
                    <p className="text-white text-xl">You do not know the secret word.</p>
                  )}
                </>
              )}
            </RoleCard>
            <PrimaryButton onClick={goHide}>
              <span className="inline-flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" aria-hidden />
                Hide
              </span>
            </PrimaryButton>
          </>
        )}
      </div>
    </ScreenShell>
  )
}
