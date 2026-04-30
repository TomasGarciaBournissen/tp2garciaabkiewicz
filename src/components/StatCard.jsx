export default function StatCard({ label, value, sub, link, linkText }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
      {link && linkText && (
        <a href={link} className="text-xs text-indigo-500 hover:underline mt-auto">
          {linkText} →
        </a>
      )}
    </div>
  )
}
