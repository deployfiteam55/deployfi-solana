export default function GlassCard({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/5 border border-purple-800/30 rounded-2xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}