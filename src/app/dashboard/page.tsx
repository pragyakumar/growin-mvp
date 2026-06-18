import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?";

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Grow<span className="text-green-500">In</span>
        </h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors"
          >
            Sign out
          </button>
        </form>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.full_name || "Anonymous"}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {profile?.bio && (
                <p className="text-gray-700 text-sm mt-2">{profile.bio}</p>
              )}
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700 mt-2"
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>

          {/* Expertise */}
          {profile?.expertise?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((e: string) => (
                  <span key={e} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full font-medium">
                    {e}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profile?.skills?.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s: string) => (
                  <span key={s} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* GrowScore Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">GrowScore</h3>
              <p className="text-gray-500 text-sm mt-0.5">
                Reflects your profile completeness and activity
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-green-500">
                {profile?.grow_score ?? 500}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">out of 1000</p>
            </div>
          </div>
          <div className="mt-4 bg-gray-100 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${((profile?.grow_score ?? 500) / 1000) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
