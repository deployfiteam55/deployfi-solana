import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

const links = [
  { path: '/',          label: 'Home' },
  { path: '/launch',    label: 'Launch' },
  { path: '/defi',      label: 'DeFi' },
  { path: '/dashboard', label: 'Dashboard' },
]

export default function Navbar() {
  const { connection } = useConnection()
  const { publicKey }  = useWallet()
  const location       = useLocation()
  const [balance, setBalance]   = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)  // ← ADD

  useEffect(() => {
    if (!publicKey) { setBalance(null); return }
    connection.getBalance(publicKey)
      .then((bal) => setBalance((bal / LAMPORTS_PER_SOL).toFixed(2)))
      .catch(console.error)
  }, [publicKey, connection])

  return (
    <>
      <nav className="fixed top-0 w-full h-16 z-50 bg-[#0D0818]/80 backdrop-blur-xl border-b border-purple-800/20">
        <div className="flex items-center justify-between px-6 md:px-8 h-full max-w-7xl mx-auto">
          {/* Logo */}
          <Link to="/" className="text-white font-black text-xl tracking-tight">
            🚀 DeployFi
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors duration-200
                  ${location.pathname === link.path
                    ? 'text-purple-400 border-b-2 border-purple-400 pb-0.5'
                    : 'text-gray-400 hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Wallet + Hamburger */}
          <div className="flex items-center gap-3">
            {balance && (
              <span className="text-cyan-400 text-sm font-bold hidden sm:block">
                ◎ {balance} SOL
              </span>
            )}
            <WalletMultiButton className="!bg-purple-600 !rounded-xl !h-9 !text-sm" />

            {/* Hamburger — ADD */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300
                ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300
                ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300
                ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — ADD */}
      {menuOpen && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-[#0D0818]/95
          backdrop-blur-xl border-b border-purple-800/20 md:hidden">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-6 py-4 text-sm font-medium border-b
                border-purple-800/10 transition-colors
                ${location.pathname === link.path
                  ? 'text-purple-400 bg-purple-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-purple-900/10'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}