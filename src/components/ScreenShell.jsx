export function ScreenShell({ title, children, footer, headerRight }) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-950 text-slate-100">
      <header className="shrink-0 border-b border-surface-700 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between gap-2">
        <h1 className="text-lg font-semibold tracking-tight text-white truncate">{title}</h1>
        {headerRight ? <div className="shrink-0">{headerRight}</div> : null}
      </header>
      <main className="flex-1 flex flex-col px-4 py-4 min-h-0 overflow-y-auto">{children}</main>
      {footer ? (
        <footer className="shrink-0 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 border-t border-surface-800 bg-surface-900/80">
          {footer}
        </footer>
      ) : null}
    </div>
  )
}

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`w-full min-h-12 rounded-xl bg-accent text-surface-950 font-semibold text-base active:scale-[0.99] transition disabled:opacity-40 disabled:active:scale-100 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`w-full min-h-12 rounded-xl border border-surface-600 bg-surface-800 text-slate-100 font-medium active:bg-surface-700 transition disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
