import { ArrowLeft } from 'lucide-react'
import { PrimaryButton, ScreenShell, SecondaryButton } from '../components/ScreenShell.jsx'

export function RulesScreen({ onBack }) {
  return (
    <ScreenShell
      title="How to play"
      headerRight={
        <SecondaryButton className="!w-auto !min-h-10 px-3 py-2 text-sm" onClick={onBack}>
          <span className="inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </span>
        </SecondaryButton>
      }
      footer={
        <PrimaryButton onClick={onBack}>Got it</PrimaryButton>
      }
    >
      <div className="max-w-md mx-auto w-full space-y-4 text-slate-200 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold mb-1">Setup</h2>
          <p>Enter player names, pick a mode, and choose how many Imposters. The app picks words and roles at random.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold mb-1">Private reveal</h2>
          <p>
            Pass the device. Only the active player taps Ready, reads their screen, then taps Hide. Do not peek over
            shoulders.
          </p>
        </section>
        <section>
          <h2 className="text-white font-semibold mb-1">Clues</h2>
          <p>Each player gives a short spoken clue on their turn. Do not say the secret word, spell it, rhyme it, or translate it.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold mb-1">Discussion and vote</h2>
          <p>Talk it out, then each player votes privately. Results show tallies and who was who.</p>
        </section>
      </div>
    </ScreenShell>
  )
}
