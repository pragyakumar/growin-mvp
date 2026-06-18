import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">GrowIn</span>
        </div>

        {/* Tagline */}
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
            Your career journey{" "}
            <span className="text-green-500">starts here</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            The fresher-first platform that combines LinkedIn, GitHub, and
            portfolio — built for the next generation of developers.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            {
              icon: "🚀",
              title: "Fresher-First",
              desc: "Built for students and new graduates",
            },
            {
              icon: "💼",
              title: "Portfolio Ready",
              desc: "Showcase your projects and skills",
            },
            {
              icon: "📈",
              title: "GrowScore",
              desc: "Track your growth with a unique score",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              <div className="text-2xl mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-3">
          <Link
            href="/login"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-colors duration-200 shadow-lg shadow-green-200"
          >
            Get Started — It&apos;s Free
          </Link>
          <p className="text-sm text-gray-400">
            No credit card required. Join thousands of freshers today.
          </p>
        </div>
      </div>
    </main>
  );
}
