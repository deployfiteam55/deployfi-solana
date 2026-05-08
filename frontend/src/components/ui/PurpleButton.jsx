export default function PurpleButton({ children, onClick, disabled, variant = 'primary', className = '' }) {
  const base = 'rounded-xl py-3 px-6 font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-purple-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/25',
    gradient: 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/25',
    outline: 'border border-purple-600 hover:bg-purple-600/20',
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  )
}