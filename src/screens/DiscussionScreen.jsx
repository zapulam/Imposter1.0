import { useEffect, useState } from 'react'
import { PrimaryButton, ScreenShell } from '../components/ScreenShell.jsx'

export function DiscussionScreen({ settings, round, onUpdateRound, onDiscussionDone }) {
  const [now, setNow] = useState(() => Date.now())
  const timer = settings.discussionTimer

  useEffect(() => {
    if (timer === 'off' || !round.discussionEndsAt) return undefined
    const id = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(id)
  }, [timer, round.discussionEndsAt])

  const startDiscussion = () => {
    if (timer === 'off') {
      onUpdateRound((r) => ({ ...r, discussionEndsAt: null }))
      return
    }
    const ends = Date.now() + timer * 1000
    onUpdateRound((r) => ({ ...r, discussionEndsAt: ends }))
  }

  const remainingSec =
    timer !== 'off' && round.discussionEndsAt ? Math.max(0, Math.ceil((round.discussionEndsAt - now) / 1000)) : null

  const footer = (
    <div className="flex flex-col gap-2">
      {timer !== 'off' && !round.discussionEndsAt ? (
        <PrimaryButton onClick={startDiscussion}>Start timer</PrimaryButton>
      ) : null}
      {timer !== 'off' && round.discussionEndsAt ? (
        <p className="text-center text-2xl font-mono text-white tabular-nums">
          {Math.floor(remainingSec / 60)
            .toString()
            .padStart(2, '0')}
          :{(remainingSec % 60).toString().padStart(2, '0')}
        </p>
      ) : null}
      <PrimaryButton onClick={onDiscussionDone}>Continue to voting</PrimaryButton>
    </div>
  )

  return (
    <ScreenShell title="Discussion" footer={footer}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center gap-4">
        <p className="text-slate-300 text-center leading-relaxed">
          Talk about the clues. Who sounded unsure? Who matched the word a little too well?
        </p>
        {timer === 'off' ? (
          <p className="text-slate-500 text-sm text-center">No timer—wrap up whenever the group is ready.</p>
        ) : !round.discussionEndsAt ? (
          <p className="text-slate-500 text-sm text-center">Optional: start the timer when discussion begins.</p>
        ) : null}
      </div>
    </ScreenShell>
  )
}
