import InputField from '../ui/InputField'

export default function LaunchForm({ form, onChange, onImageChange, preview, loading, onSubmit }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black text-white">Launch Your Token</h1>
      <p className="text-gray-400">Create your SPL token on Solana in seconds.</p>

      <InputField label="Token Name" name="name" value={form.name} onChange={onChange} placeholder="e.g. DegenCoin" />
      <InputField label="Symbol (max 5)" name="symbol" value={form.symbol} onChange={onChange} placeholder="e.g. DGEN" maxLength={5} />
      <InputField label="Total Supply" name="supply" value={form.supply} onChange={onChange} placeholder="e.g. 1000000" type="number" />
      <InputField label="Price (SOL per token)" name="price" value={form.price} onChange={onChange} placeholder="e.g. 0.001" type="number" />

      <div className="flex flex-col gap-1">
        <label className="text-gray-400 text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="What is your token about?"
          rows={3}
          className="w-full bg-white/5 border border-purple-800/40 rounded-xl px-4 py-3
                     text-white placeholder-gray-600 focus:border-purple-500 outline-none
                     resize-none transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-gray-400 text-sm font-medium">Token Image</label>
        <label className="w-full border-2 border-dashed border-purple-800/40 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500/60 transition-colors">
          {preview
            ? <img src={preview} className="w-20 h-20 rounded-xl mx-auto" alt="Token preview" />
            : <span className="text-gray-500 text-sm">Click to upload image (PNG/JPG)</span>}
          <input type="file" accept="image/*" onChange={onImageChange} className="hidden" />
        </label>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading || !form.name || !form.symbol}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl py-4
                   text-white font-bold text-lg hover:-translate-y-1 transition-transform
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {loading ? '⏳ Launching...' : '🚀 Launch Token'}
      </button>
    </div>
  )
}