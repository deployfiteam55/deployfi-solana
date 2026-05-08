import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import LaunchForm from '../components/token/LaunchForm'
import SuccessScreen from '../components/token/SuccessScreen'
import ProgressBar from '../components/ui/ProgressBar'
import { uploadTokenToIPFS } from '../utils/ipfs'
import { createToken } from '../utils/contract'
import useAppStore from '../store/useAppStore'

const INIT_FORM = { name: '', symbol: '', supply: '', price: '', description: '' }

export default function Launch() {
  const { connection } = useConnection()
  const wallet         = useWallet()
  const addLaunch      = useAppStore((s) => s.addLaunch)

  const [form,    setForm]    = useState(INIT_FORM)
  const [image,   setImage]   = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [step,    setStep]    = useState(0) // 0=idle, 1=ipfs, 2=chain
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleLaunch = async () => {
    if (!wallet.connected) { setError('Please connect your wallet first.'); return }
    setError(null)
    setLoading(true)
    try {
      // Step 1 — Upload to IPFS
      setStep(1)
      const uri = await uploadTokenToIPFS(image, form)

      // Step 2 — Create token on-chain
      setStep(2)
      const res = await createToken(connection, wallet, { ...form, metadataUri: uri })

      addLaunch({ ...form, txId: res.txId, mintAddress: res.mintAddress, timestamp: Date.now() })
      setResult(res)
    } catch (e) {
      console.error(e)
      setError(e.message || 'Launch failed. Check console for details.')
    } finally {
      setLoading(false)
      setStep(0)
    }
  }

  const handleReset = () => { setForm(INIT_FORM); setImage(null); setPreview(null); setResult(null) }

  if (result) return <SuccessScreen txId={result.txId} mintAddress={result.mintAddress} onReset={handleReset} />

  return (
    <div className="min-h-screen bg-[#0D0818] pt-24 pb-16 px-8">
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Left — Form */}
        <div>
          <LaunchForm
            form={form}
            onChange={handleChange}
            onImageChange={handleImage}
            preview={preview}
            loading={loading}
            onSubmit={handleLaunch}
          />

          {/* Progress */}
          {loading && (
            <div className="mt-6 space-y-3">
              <ProgressBar value={step} max={2} label={step === 1 ? 'Uploading to IPFS...' : 'Creating on-chain...'} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right — Live Preview Card */}
        <div>
          <h2 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Live Preview</h2>
          <div className="bg-white/5 border border-purple-800/30 rounded-2xl p-6 backdrop-blur-sm sticky top-24">
            {preview
              ? <img src={preview} className="w-24 h-24 rounded-xl mb-4 object-cover" alt="Token" />
              : <div className="w-24 h-24 bg-gradient-to-br from-purple-600/40 to-cyan-500/40 rounded-xl mb-4 flex items-center justify-center text-3xl">🪙</div>}
            <h2 className="text-white text-2xl font-black">{form.name || 'Token Name'}</h2>
            <p className="text-gray-400 font-mono">${form.symbol || 'TKN'}</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Supply</span>
                <span className="text-cyan-400 font-bold">{Number(form.supply || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price</span>
                <span className="text-purple-400 font-bold">{form.price || '0'} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Network</span>
                <span className="text-green-400 font-bold">Devnet</span>
              </div>
            </div>
            {form.description && (
              <p className="text-gray-400 text-sm mt-4 border-t border-white/10 pt-4">{form.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}