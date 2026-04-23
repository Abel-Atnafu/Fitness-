export function Spinner({ size = 24 }) {
  return (
    <div
      className="rounded-full border-2 border-white/10 border-t-gold-400 animate-spin"
      style={{ width: size, height: size }}
    />
  )
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #060b18 0%, #0d1526 50%, #111d35 100%)' }}>
      <div className="flex flex-col items-center gap-5">
        <div className="text-6xl animate-float">🔥</div>
        <Spinner size={36} />
        <p className="text-white/30 text-sm font-medium">Loading FitEthio…</p>
      </div>
    </div>
  )
}
