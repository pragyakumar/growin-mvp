"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const EXPERTISE_OPTIONS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "Mobile",
  "Data Science",
  "ML/AI",
  "DevOps",
  "UI/UX",
  "Other",
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  function toggleExpertise(option: string) {
    setExpertise((prev) =>
      prev.includes(option)
        ? prev.filter((e) => e !== option)
        : [...prev, option]
    );
  }

  async function handleComplete() {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // Generate username from full name
    const username =
      fullName.toLowerCase().replace(/\s+/g, ".") +
      "." +
      Math.floor(Math.random() * 1000);

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      username,
      bio,
      expertise,
      skills,
      github_url: githubUrl,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">GrowIn</span>
          </div>
          <p className="mt-2 text-gray-500">Let&apos;s set up your profile</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  s <= step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-12 h-1 mx-1 rounded transition-colors ${
                    s < step ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Full Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  What&apos;s your name?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  This will be displayed on your profile
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!fullName.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Step 2: Expertise */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  What&apos;s your expertise?
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Select all that apply
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {EXPERTISE_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => toggleExpertise(option)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors ${
                      expertise.includes(option)
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-green-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={expertise.length === 0}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Bio, Skills, GitHub */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Tell us more about you
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Almost done! Fill in the details below
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what you're working on..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills{" "}
                    <span className="text-gray-400 font-normal">
                      (comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="React, TypeScript, Node.js, Python..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GitHub URL{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourusername"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 border border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                >
                  {loading ? "Saving..." : "Complete Profile 🎉"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
