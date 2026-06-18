import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/onboarding");
  }

  const initials = profile.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?";

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-lg font-bold text-gray-900">GrowIn</span>
          </div>
          <SignOutButton />
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <span className="text-green-600 font-bold text-2xl">
                  {initials}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.full_name || "Anonymous User"}
              </h1>
              {profile.username && (
                <p className="text-gray-500 text-sm">@{profile.username}</p>
              )}
              {profile.bio && (
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {profile.bio}
                </p>
              )}

              {/* Expertise badges */}
              {profile.expertise && profile.expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.expertise.map((exp: string) => (
                    <span
                      key={exp}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* GitHub */}
          {profile.github_url && (
            <div className="mt-4">
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span>GitHub Profile</span>
              </a>
            </div>
          )}
        </div>

        {/* GrowScore Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold opacity-90">GrowScore</h2>
              <p className="text-4xl font-extrabold mt-1">
                {profile.grow_score ?? 500}
              </p>
              <p className="text-sm mt-2 opacity-80 max-w-xs">
                Your GrowScore reflects your profile completeness and activity
              </p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">📈</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white border-opacity-20">
            <p className="text-xs opacity-70">
              Complete your profile and stay active to increase your score
            </p>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Account
          </h3>
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p className="text-gray-600 text-sm mt-1">
            <span className="font-medium">Member since:</span>{" "}
            {new Date(user.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </main>
  );
}
