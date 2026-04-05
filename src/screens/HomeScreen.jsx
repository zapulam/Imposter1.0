import { BookOpen, Play } from 'lucide-react'
import { PrimaryButton, SecondaryButton, ScreenShell } from '../components/ScreenShell.jsx'

export function HomeScreen({ onStart, onRules }) {
  return (
    <ScreenShell
      title="Imposter"
      footer={
        <div className="flex flex-col gap-3">
          <PrimaryButton onClick={onStart}>
            <span className="inline-flex items-center justify-center gap-2">
              <Play className="w-5 h-5" aria-hidden />
              Start new game
            </span>
          </PrimaryButton>
          <SecondaryButton onClick={onRules}>
            <span className="inline-flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" aria-hidden />
              How to play
            </span>
          </SecondaryButton>
        </div>
      }
    >
      <div className="flex-1 flex flex-col justify-center gap-4 max-w-md mx-auto w-full">
        <p className="text-slate-300 text-base leading-relaxed">
          Pass one phone around. Everyone gets a secret role and word. Give clues, discuss, vote. No accounts, no
          servers—just your group in the same room.
        </p>
        <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
          <li>Classic: Imposters do not know the real word.</li>
          <li>Multi-word: Imposters share a different (related) word.</li>
        </ul>
      </div>
    </ScreenShell>
  )
}
