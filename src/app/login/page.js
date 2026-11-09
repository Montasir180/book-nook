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
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
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
        setError(
          error.message || "Invalid email or password."
        );
        return;
      }

      router.push("/profile");
      router.refresh();

    } catch (err) {
      console.error("Login Error:", err);

      setError(
        "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F7F4EC] px-4 py-14 text-[#252722]">

      {/* Background */}
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
            <span className="text-[#B84E2D]">
              starts here.
            </span>
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#252722]/60">
            Sign in to access your personal library,
            discover books and continue reading.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">

          <div className="h-px flex-1 bg-[#E4DED2]" />

          <span className="text-xs font-medium text-[#252722]/40">
            SIGN IN WITH EMAIL
          </span>

          <div className="h-px flex-1 bg-[#E4DED2]" />

        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">

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
                disabled={loading}
                className="w-full rounded-xl border border-[#E4DED2] bg-[#F9F8F5] py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#252722]/35 focus:border-[#B84E2D] focus:ring-2 focus:ring-[#B84E2D]/10 disabled:opacity-60"
              />

            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Password
            </label>

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
                disabled={loading}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
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

        {/* Security */}
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#F7F4EC] p-4">

          <ShieldCheck
            size={20}
            className="mt-0.5 shrink-0 text-[#B84E2D]"
          />

          <p className="text-xs leading-5 text-[#252722]/65">
            Your account is securely authenticated.
            Your password is protected with secure password hashing.
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