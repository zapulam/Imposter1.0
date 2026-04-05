import { PrimaryButton, ScreenShell } from '../components/ScreenShell.jsx'

export function ClueTurnScreen({ players, round, onUpdateRound, onCluesDone }) {
  const ordered = round.clueOrder.map((id) => players.find((p) => p.id === id)).filter(Boolean)
  const current = ordered[round.clueIndex]

  const advance = () => {
    const next = round.clueIndex + 1
    if (next >= ordered.length) {
      onCluesDone()
      return
    }
    onUpdateRound((r) => ({ ...r, clueIndex: next }))
  }

  const isLast = round.clueIndex + 1 >= ordered.length

  return (
    <ScreenShell
      title="Clues"
      footer={
        <div className="flex flex-col gap-2">
          <PrimaryButton onClick={advance}>{isLast ? 'Finish clues' : 'Next player'}</PrimaryButton>
          <p className="text-center text-xs text-slate-500">
            Say your clue out loud—one short word or phrase. No spelling, rhymes, translations, or the exact word.
          </p>
        </div>
      }
    >
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center gap-6">
        <p className="text-center text-slate-400 text-sm">
          Clue {round.clueIndex + 1} of {ordered.length}
        </p>
        <p className="text-center text-slate-300 text-lg">It is your turn</p>
        <p className="text-center text-white text-3xl font-bold">{current.name}</p>
        <p className="text-center text-slate-400">Give your spoken clue to the group.</p>
      </div>
    </ScreenShell>
  )
}
