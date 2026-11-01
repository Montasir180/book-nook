"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import {
BookOpen,
ArrowLeft,
Loader2,
ShieldCheck,
Eye,
EyeOff,
Mail,
Lock,
} from "lucide-react";

export default function LoginPage() {
const router = useRouter();

const [loading, setLoading] = useState(false);
const [githubLoading, setGithubLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);

const [error, setError] = useState("");

const [formData, setFormData] = useState({
email: "",
password: "",
});

// Input Handler
const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

// Email & Password Login
const handleEmailLogin = async (e) => {
e.preventDefault();


setError("");

try {
  setLoading(true);

  const { error } = await authClient.signIn.email({
    email: formData.email.trim(),
    password: formData.password,
    callbackURL: "/profile",
  });

  if (error) {
    setError(error.message || "Invalid email or password.");
    return;
  }

  router.push("/profile");
  router.refresh();

} catch (err) {
  console.error("Email login error:", err);
  setError("Something went wrong. Please try again.");
} finally {
  setLoading(false);
}


};

// GitHub Login
const handleGitHubLogin = async () => {
try {
setGithubLoading(true);
setError("");


  const { error } = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/profile",
    errorCallbackURL: "/login",
  });

  if (error) {
    setError(error.message || "GitHub login failed.");
    setGithubLoading(false);
  }

} catch (err) {
  console.error("GitHub login error:", err);
  setError("Unable to connect with GitHub. Please try again.");
  setGithubLoading(false);
}


};

return ( <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F4EC] px-4 py-14 text-[#252722]">


  {/* Background Decorations */}
  <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#B84E2D]/10 blur-3xl" />

  <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#D7C9A8]/30 blur-3xl" />

  {/* Back Home */}
  <Link
    href="/"
    className="absolute left-6 top-6 flex items-center gap-2 text-sm font-medium text-[#252722]/70 transition hover:text-[#B84E2D]"
  >
    <ArrowLeft size={17} />
    Back to Home
  </Link>

  {/* Login Card */}
  <section className="relative z-10 my-8 w-full max-w-md rounded-3xl border border-[#E4DED2] bg-white/80 p-6 shadow-[0_20px_80px_rgba(37,39,34,0.08)] backdrop-blur-xl sm:p-10">

    {/* Logo */}
    <Link
      href="/"
      className="mb-8 flex items-center justify-center gap-2"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#252722] text-[#F7F4EC]">
        <BookOpen size={23} />
      </div>

      <span className="text-2xl font-bold tracking-tight">
        Book<span className="text-[#B84E2D]">Nook</span>
      </span>
    </Link>

    {/* Heading */}
    <div className="mb-7 text-center">

      <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#B84E2D]">
        Welcome Back
      </p>

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Your reading journey
        <br />
        <span className="text-[#B84E2D]">starts here.</span>
      </h1>

      <p className="mt-4 text-sm leading-6 text-[#252722]/60">
        Sign in to access your personal library,
        discover books and continue reading.
      </p>
    </div>

    {/* Error Message */}
    {error && (
      <div
        role="alert"
        className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
      >
        {error}
      </div>
    )}

    {/* GitHub Login */}
    <button
      type="button"
      onClick={handleGitHubLogin}
      disabled={loading || githubLoading}
      className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#252722] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#252722]/10 transition duration-300 hover:-translate-y-0.5 hover:bg-[#B84E2D] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
    >
      {githubLoading ? (
        <Loader2 size={21} className="animate-spin" />
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.75-1.31-3.75-1.31-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.71 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.62 5.25-5.11 5.53.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
        </svg>
      )}

      {githubLoading
        ? "Connecting to GitHub..."
        : "Continue with GitHub"}
    </button>

    {/* Divider */}
    <div className="my-6 flex items-center gap-4">
      <div className="h-px flex-1 bg-[#E4DED2]" />

      <span className="text-xs font-medium text-[#252722]/40">
        OR CONTINUE WITH EMAIL
      </span>

      <div className="h-px flex-1 bg-[#E4DED2]" />
    </div>

    {/* Email Login Form */}
    <form onSubmit={handleEmailLogin} className="space-y-4">

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold"
        >
          Email Address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#252722]/40"
          />

          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            disabled={loading || githubLoading}
            className="w-full rounded-xl border border-[#E4DED2] bg-[#F9F8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#252722]/35 focus:border-[#B84E2D] focus:ring-2 focus:ring-[#B84E2D]/10 disabled:opacity-60"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-sm font-semibold"
          >
            Password
          </label>
        </div>

        <div className="relative">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#252722]/40"
          />

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            disabled={loading || githubLoading}
            className="w-full rounded-xl border border-[#E4DED2] bg-[#F9F8F5] py-3.5 pl-11 pr-12 text-sm outline-none transition placeholder:text-[#252722]/35 focus:border-[#B84E2D] focus:ring-2 focus:ring-[#B84E2D]/10 disabled:opacity-60"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Hide password" : "Show password"
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#252722]/40 transition hover:text-[#B84E2D]"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || githubLoading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#B84E2D] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B84E2D]/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#963C22] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={19} className="animate-spin" />
            Signing In...
          </>
        ) : (
          "Sign In to BookNook"
        )}
      </button>
    </form>

    {/* Security Info */}
    <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F7F4EC] p-4">
      <ShieldCheck
        size={20}
        className="mt-0.5 shrink-0 text-[#B84E2D]"
      />

      <p className="text-xs leading-5 text-[#252722]/65">
        Your account is securely authenticated.
        Your password is never shared with GitHub.
      </p>
    </div>

    {/* Footer */}
    <div className="mt-8 border-t border-[#E4DED2] pt-6 text-center">

      <p className="text-sm text-[#252722]/60">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#B84E2D] transition hover:underline"
        >
          Create Account
        </Link>
      </p>

      <Link
        href="/"
        className="mt-5 inline-block text-xs font-semibold text-[#252722]/50 transition hover:text-[#B84E2D]"
      >
        Explore BookNook
      </Link>
    </div>
  </section>

  {/* Copyright */}
<p className="absolute bottom-5 text-xs text-[#252722]/40">
  © 2026 BookNook. All rights reserved.
</p>

</main>


);
}
