import { PrimaryButton, ScreenShell, SecondaryButton } from '../components/ScreenShell.jsx'

export function VotingScreen({ players, settings, round, onUpdateRound, onVotingComplete }) {
  const voter = players[round.voteIndex]
  const stage = round.voteStage

  const candidates = (() => {
    if (round.isRunoff && round.runoffCandidates?.length) {
      return players.filter((p) => round.runoffCandidates.includes(p.id))
    }
    return players.filter((p) => settings.allowSelfVote || !voter || p.id !== voter.id)
  })()

  const beginPick = () => onUpdateRound((r) => ({ ...r, voteStage: 'pick' }))

  const selectTarget = (id) => onUpdateRound((r) => ({ ...r, selectedVoteTarget: id, voteStage: 'confirm' }))

  const backToPick = () => onUpdateRound((r) => ({ ...r, voteStage: 'pick', selectedVoteTarget: null }))

  const confirmVote = () => {
    const votes = { ...round.votes, [voter.id]: round.selectedVoteTarget }
    const nextIndex = round.voteIndex + 1
    const base = { ...round, votes, voteIndex: nextIndex, voteStage: 'pass', selectedVoteTarget: null }
    if (nextIndex >= players.length) {
      onVotingComplete(base)
      return
    }
    onUpdateRound(() => ({ ...base }))
  }

  const title = round.isRunoff ? 'Runoff vote' : 'Voting'

  return (
    <ScreenShell title={title} footer={null}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-4">
        {round.isRunoff ? (
          <p className="text-center text-sm text-warn">Vote again among the tied players only.</p>
        ) : null}

        {stage === 'pass' ? (
          <div className="flex flex-col gap-6 justify-center flex-1">
            <p className="text-center text-slate-300 text-lg">Pass the device to</p>
            <p className="text-center text-white text-3xl font-bold">{voter.name}</p>
            <p className="text-center text-slate-400 text-sm">Vote privately. Do not show your choice.</p>
            <PrimaryButton onClick={beginPick}>Ready to vote</PrimaryButton>
          </div>
        ) : null}

        {stage === 'pick' ? (
          <div className="flex flex-col gap-3 flex-1">
            <p className="text-slate-300 text-center">
              <span className="text-white font-semibold">{voter.name}</span>, who do you suspect?
            </p>
            <div className="flex flex-col gap-2">
              {candidates.map((p) => (
                <SecondaryButton key={p.id} className="!min-h-12 text-left px-4" onClick={() => selectTarget(p.id)}>
                  {p.name}
                </SecondaryButton>
              ))}
            </div>
          </div>
        ) : null}

        {stage === 'confirm' ? (
          <div className="flex flex-col gap-4 justify-center flex-1">
            <p className="text-center text-slate-300">You selected</p>
            <p className="text-center text-white text-2xl font-bold">
              {players.find((p) => p.id === round.selectedVoteTarget)?.name}
            </p>
            <PrimaryButton onClick={confirmVote}>Submit vote</PrimaryButton>
            <SecondaryButton onClick={backToPick}>Go back</SecondaryButton>
          </div>
        ) : null}
      </div>
    </ScreenShell>
  )
}
