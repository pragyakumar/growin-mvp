import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Built for freshers, by freshers
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Grow<span className="text-green-500">In</span>
        </h1>
        <p className="text-xl text-gray-600 mb-3">
          Your career journey starts here.
        </p>
        <p className="text-gray-500 mb-10">
          Build your developer profile, track your GrowScore, and get discovered
          by companies looking for fresh talent.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 hover:border-green-400 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-3 gap-8 text-center max-w-lg">
        {[
          { label: "GrowScore", desc: "Track your progress" },
          { label: "Portfolio", desc: "Showcase your work" },
          { label: "Connect", desc: "Find opportunities" },
        ].map(({ label, desc }) => (
          <div key={label}>
            <p className="font-semibold text-gray-800">{label}</p>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
