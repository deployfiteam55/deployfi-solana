export default function InputField({ label, name, value, onChange, placeholder, type = 'text', maxLength }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-gray-400 text-sm font-medium">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-white/5 border border-purple-800/40 rounded-xl px-4 py-3
                   text-white placeholder-gray-600 focus:border-purple-500 outline-none
                   transition-colors duration-200"
      />
    </div>
  )
}