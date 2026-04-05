import { useState } from 'react'
import { PrimaryButton, ScreenShell } from '../components/ScreenShell.jsx'
import { guessMatchesWord } from '../game/logic.js'

export function ImposterGuessScreen({ guessPlayer, round, onComplete }) {
  const [stage, setStage] = useState('pass')
  const [guess, setGuess] = useState('')

  return (
    <ScreenShell title="Last guess" footer={null}>
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col gap-6 justify-center">
        {stage === 'pass' ? (
          <>
            <p className="text-center text-slate-300 text-lg">Pass the device to</p>
            <p className="text-center text-white text-3xl font-bold">{guessPlayer.name}</p>
            <p className="text-center text-slate-400 text-sm">You were voted out. You get one guess at the crew word.</p>
            <PrimaryButton onClick={() => setStage('guess')}>Ready</PrimaryButton>
          </>
        ) : (
          <>
            <p className="text-warn text-sm text-center">Do not let others see your guess.</p>
            <label className="flex flex-col gap-2 text-sm text-slate-300">
              Type the crew word
              <input
                className="min-h-12 rounded-xl bg-surface-800 border border-surface-600 px-3 text-white"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
              />
            </label>
            <PrimaryButton
              onClick={() => {
                const correct = guessMatchesWord(guess, round.normalWord)
                onComplete(correct)
              }}
            >
              Lock in guess
            </PrimaryButton>
          </>
        )}
      </div>
    </ScreenShell>
  )
}
