import {
  BookOpen,
  EyeOff,
  Play,
  Smartphone,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react'
import { PrimaryButton, SecondaryButton } from '../components/ScreenShell.jsx'

function FeatureTile({ icon: Icon, label, sub }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-surface-900/50 backdrop-blur-md px-3 py-3 text-center shadow-lg shadow-black/20">
      <div className="mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-200">{label}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-slate-500">{sub}</p>
    </div>
  )
}

function ModeCard({ title, description, accent }) {
  return (
    <div
      className={`rounded-2xl border bg-surface-900/40 p-4 backdrop-blur-sm ${accent === 'emerald' ? 'border-accent/25' : 'border-violet-400/20'}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent === 'emerald' ? 'bg-accent/15 text-accent' : 'bg-violet-500/15 text-violet-300'}`}
        >
          {accent === 'emerald' ? <Users className="h-5 w-5" aria-hidden /> : <Swords className="h-5 w-5" aria-hidden />}
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
        </div>
      </div>
    </div>
  )
}

export function HomeScreen({ onStart, onRules }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-surface-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-20%] h-[22rem] w-[22rem] rounded-full bg-accent/20 blur-[100px]" />
        <div className="absolute top-1/3 left-[-30%] h-[18rem] w-[18rem] rounded-full bg-emerald-600/10 blur-[90px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-56 w-56 rounded-full bg-violet-600/15 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(148,163,184,0.12) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <main className="relative z-10 flex flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-4 min-h-0 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 py-2">
          <div className="text-center space-y-4">
            <p className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              In-person party game
            </p>
            <div className="space-y-2">
              <h1 className="text-[2.75rem] font-black leading-[0.95] tracking-tight sm:text-6xl">
                <span className="bg-gradient-to-br from-white via-slate-100 to-slate-500 bg-clip-text text-transparent">
                  Imposter
                </span>
              </h1>
              <p className="mx-auto max-w-[20rem] text-base leading-snug text-slate-400">
                One phone. Secret words. <span className="text-slate-200">Clues, tension, and a vote</span>—no apps, no
                accounts, no Wi‑Fi required.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <FeatureTile icon={Smartphone} label="Pass & play" sub="One device for the table" />
            <FeatureTile icon={EyeOff} label="Private reveals" sub="Roles stay hidden" />
            <FeatureTile icon={Users} label="3–20 players" sub="Names or quick defaults" />
          </div>

          <div className="space-y-2">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Pick your vibe</p>
            <div className="flex flex-col gap-2">
              <ModeCard
                accent="emerald"
                title="Classic"
                description="Crew shares one word. Imposters hear nothing—or only a broad category—and must bluff from context."
              />
              <ModeCard
                accent="violet"
                title="Multi-word"
                description="Crew and Imposters each have a real word. Clues collide, alliances form, and side-eye gets tactical."
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 shrink-0 border-t border-white/5 bg-surface-950/80 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          <PrimaryButton onClick={onStart}>
            <span className="inline-flex items-center justify-center gap-2">
              <Play className="h-5 w-5" aria-hidden />
              Start new game
            </span>
          </PrimaryButton>
          <SecondaryButton
            onClick={onRules}
            className="border-white/15 bg-white/5 text-slate-100 hover:bg-white/10"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <BookOpen className="h-5 w-5" aria-hidden />
              How to play
            </span>
          </SecondaryButton>
        </div>
      </footer>
    </div>
  )
}
