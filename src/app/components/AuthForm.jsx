"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  BookOpen,
  Bookmark,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Library,
  LoaderCircle,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";

import { signIn, signUp, useSession } from "@/lib/auth-client";

const COPY = {
  signin: {
    eyebrow: "WELCOME BACK",
    asideTitle: (
      <>
        Pick up where you <em>left off</em>.
      </>
    ),
    asideCopy:
      "Sign in to revisit your shelf, keep track of your borrows, and settle into your next great read.",
    formTitle: "Sign in to BookNook",
    formSubtitle:
      "Enter your details below and we will open your reading nook.",
    submit: "Sign In",
    loading: "Signing you in...",
    google: "Continue with Google",
    switchText: "New to BookNook?",
    switchLabel: "Create an account",
    switchHref: "/signup",
    success: "Welcome back! Opening your nook...",
  },
  signup: {
    eyebrow: "JOIN BOOKNOOK",
    asideTitle: (
      <>
        Your next <em>chapter</em> starts here.
      </>
    ),
    asideCopy:
      "Create a free account to build your personal shelf, share books, and borrow from readers around you.",
    formTitle: "Create your account",
    formSubtitle:
      "A few details and your own little reading space is ready.",
    submit: "Create Account",
    loading: "Creating your account...",
    google: "Sign up with Google",
    switchText: "Already have an account?",
    switchLabel: "Sign in",
    switchHref: "/login",
    success: "Your nook is ready! Taking you home...",
  },
};

const PERKS = [
  { icon: Library, label: "Curate your personal shelf" },
  { icon: Bookmark, label: "Borrow and lend with readers" },
  { icon: Sparkles, label: "Keep every reading moment" },
];

function GoogleMark() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function friendlyError(error, mode) {
  const message = error?.message || "";
  const code = error?.code || "";

  if (
    code === "INVALID_EMAIL_OR_PASSWORD" ||
    (mode === "signin" && /invalid/i.test(message))
  ) {
    return "That email and password do not match. Please try again.";
  }

  if (
    code === "USER_ALREADY_EXISTS" ||
    /already exists/i.test(message)
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (
    code === "PASSWORD_TOO_SHORT" ||
    /password.*(short|least)/i.test(message)
  ) {
    return "Your password needs to be at least 6 characters long.";
  }

  return message || "Something went wrong. Please try again.";
}

export default function AuthForm({ mode = "signin" }) {
  const copy = COPY[mode] ?? COPY.signin;
  const isSignup = mode === "signup";

  const router = useRouter();
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (session?.user) {
      router.replace("/");
    }
  }, [session, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Please enter your name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (isSignup && password.length < 6) {
      setError("Your password needs to be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const result = isSignup
        ? await signUp.email({
            name: cleanName,
            email: cleanEmail,
            password,
          })
        : await signIn.email({
            email: cleanEmail,
            password,
            rememberMe: true,
          });

      if (result?.error) {
        throw result.error;
      }

      setSuccess(
        isSignup ? copy.success : `Welcome back, ${cleanName}! Opening your nook...`,
      );

      window.setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 650);
    } catch (authError) {
      setError(friendlyError(authError, mode));
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);

    try {
      const result = await signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: isSignup ? "/signup" : "/login",
      });

      if (result?.error) {
        throw result.error;
      }
    } catch (authError) {
      const message = authError?.message || "";

      setError(
        !message || /client|secret|provider|config/i.test(message)
          ? "Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local."
          : message,
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <style>{`
        .auth-page {
          position: relative;
          min-height: calc(100vh - 78px);
          min-height: calc(100dvh - 78px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 36px 4% 46px;
          overflow: hidden;
          background:
            radial-gradient(900px 520px at 6% -4%, rgba(182, 139, 85, 0.17), transparent 62%),
            radial-gradient(760px 540px at 102% 104%, rgba(38, 60, 50, 0.13), transparent 64%),
            #f4f1e8;
        }

        .auth-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(2px);
        }

        .auth-orb-one {
          width: 330px;
          height: 330px;
          top: 4%;
          left: -150px;
          background: rgba(182, 139, 85, 0.13);
        }

        .auth-orb-two {
          width: 260px;
          height: 260px;
          right: -100px;
          bottom: 2%;
          background: rgba(38, 60, 50, 0.09);
        }

        .auth-shell {
          position: relative;
          z-index: 1;
          width: min(1080px, 100%);
          margin-block: auto;
          display: grid;
          grid-template-columns: 1.02fr 1fr;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(255, 255, 255, 0.95);
          border-radius: 30px;
          box-shadow:
            0 30px 80px rgba(31, 48, 40, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.9) inset;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        /* ---------- LEFT PANEL ---------- */

        .auth-aside {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 44px;
          min-height: 620px;
          padding: 50px 48px;
          overflow: hidden;
          color: #f3efe5;
          background:
            radial-gradient(520px 320px at 104% -6%, rgba(182, 139, 85, 0.3), transparent 62%),
            linear-gradient(155deg, #2b4338 0%, #20342b 55%, #192a22 100%);
        }

        .auth-aside::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.32;
          background-image: radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px);
          background-size: 22px 22px;
          pointer-events: none;
        }

        .auth-aside::after {
          content: "";
          position: absolute;
          right: -215px;
          bottom: -190px;
          width: 430px;
          height: 430px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 50%;
          box-shadow:
            0 0 0 70px rgba(255, 255, 255, 0.025),
            0 0 0 140px rgba(255, 255, 255, 0.018);
          pointer-events: none;
        }

        .auth-brand {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 11px;
          width: fit-content;
          color: inherit;
          text-decoration: none;
        }

        .auth-brand-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f3efe5;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 13px;
          transition: all 0.35s ease;
        }

        .auth-brand:hover .auth-brand-icon {
          transform: rotate(-8deg) scale(1.05);
          background: #b68b55;
          border-color: #b68b55;
        }

        .auth-brand-name {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .auth-brand-name span {
          color: #d3ab72;
        }

        .auth-brand small {
          display: block;
          margin-top: 2px;
          color: rgba(243, 239, 229, 0.55);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .auth-aside-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .auth-eyebrow {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          gap: 8px;
          padding: 7px 12px;
          color: #e0bd88;
          background: rgba(211, 171, 114, 0.1);
          border: 1px solid rgba(211, 171, 114, 0.34);
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.7px;
        }

        .auth-aside-title {
          max-width: 420px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 4vw, 52px);
          font-weight: 500;
          line-height: 1.03;
          letter-spacing: -1.4px;
        }

        .auth-aside-title em {
          color: #d3ab72;
          font-style: italic;
        }

        .auth-aside-copy {
          max-width: 370px;
          margin: 0;
          color: rgba(243, 239, 229, 0.68);
          font-size: 13.5px;
          line-height: 1.75;
        }

        .auth-perks {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-top: 6px;
        }

        .auth-perk {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(243, 239, 229, 0.82);
          font-size: 12px;
          font-weight: 600;
        }

        .auth-perk-icon {
          width: 25px;
          height: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #d3ab72;
          background: rgba(211, 171, 114, 0.14);
          border-radius: 8px;
        }

        .auth-quote {
          position: relative;
          z-index: 1;
          margin: 0;
          padding-top: 20px;
          color: rgba(243, 239, 229, 0.55);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 12.5px;
          font-style: italic;
          line-height: 1.6;
        }

        .auth-quote span {
          color: rgba(211, 171, 114, 0.8);
          font-family: inherit;
          font-size: 10px;
          font-style: normal;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* ---------- RIGHT PANEL ---------- */

        .auth-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 50px 42px;
        }

        .auth-panel-head {
          margin-bottom: 25px;
        }

        .auth-kicker {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          color: #b68b55;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.8px;
        }

        .auth-kicker-dot {
          width: 6px;
          height: 6px;
          background: #b68b55;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(182, 139, 85, 0.14);
        }

        .auth-title {
          margin: 0 0 8px;
          color: #263c32;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 31px;
          font-weight: 600;
          line-height: 1.16;
          letter-spacing: -0.8px;
        }

        .auth-subtitle {
          margin: 0;
          color: #788178;
          font-size: 12.5px;
          line-height: 1.65;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .auth-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #3c4a40;
          font-size: 10.5px;
          font-weight: 750;
          letter-spacing: 0.2px;
        }

        .auth-label span {
          color: #9aa199;
          font-size: 9.5px;
          font-weight: 600;
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .auth-input-icon {
          position: absolute;
          left: 14px;
          color: #98a099;
          pointer-events: none;
          transition: color 0.25s ease;
        }

        .auth-input {
          width: 100%;
          height: 46px;
          padding: 0 45px 0 42px;
          color: #263c32;
          background: #fbfaf6;
          border: 1px solid #e3e2d8;
          border-radius: 12px;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.25s ease;
        }

        .auth-input::placeholder {
          color: #a8aea7;
          font-weight: 400;
        }

        .auth-input:hover {
          border-color: #d2d0c4;
        }

        .auth-input:focus {
          background: #ffffff;
          border-color: #b68b55;
          box-shadow: 0 0 0 4px rgba(182, 139, 85, 0.13);
        }

        .auth-input-wrap:focus-within .auth-input-icon {
          color: #b68b55;
        }

        .auth-eye {
          position: absolute;
          right: 9px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #98a099;
          background: transparent;
          border: 0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-eye:hover {
          color: #263c32;
          background: #f0eee4;
        }

        .auth-alert {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 11px 13px;
          border-radius: 11px;
          font-size: 11.5px;
          line-height: 1.5;
        }

        .auth-alert svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .auth-alert-error {
          color: #a94438;
          background: #fdf0ee;
          border: 1px solid #f3d4cf;
        }

        .auth-alert-success {
          color: #2f6a44;
          background: #edf6ef;
          border: 1px solid #cfe5d5;
        }

        .auth-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          height: 48px;
          margin-top: 3px;
          color: #ffffff;
          background: #263c32;
          border: 0;
          border-radius: 12px;
          box-shadow: 0 10px 24px rgba(38, 60, 50, 0.18);
          font-family: inherit;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-submit:hover:not(:disabled) {
          background: #b68b55;
          box-shadow: 0 14px 28px rgba(182, 139, 85, 0.25);
          transform: translateY(-2px);
        }

        .auth-submit:hover:not(:disabled) svg:last-child {
          transform: translateX(3px);
        }

        .auth-submit svg:last-child {
          transition: transform 0.3s ease;
        }

        .auth-submit:disabled,
        .auth-google:disabled {
          opacity: 0.68;
          cursor: progress;
        }

        .auth-spinner {
          animation: authSpin 0.8s linear infinite;
        }

        @keyframes authSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 20px 0 14px;
          color: #a0a69f;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, transparent, #e6e4da);
        }

        .auth-divider::after {
          background: linear-gradient(to left, transparent, #e6e4da);
        }

        .auth-google {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          width: 100%;
          height: 47px;
          color: #344139;
          background: #ffffff;
          border: 1px solid #e1e0d6;
          border-radius: 12px;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .auth-google:hover:not(:disabled) {
          background: #fbfaf6;
          border-color: #cfcdc1;
          box-shadow: 0 6px 16px rgba(31, 48, 40, 0.06);
          transform: translateY(-1px);
        }

        .auth-switch {
          margin: 22px 0 0;
          color: #818981;
          font-size: 11.5px;
          text-align: center;
        }

        .auth-switch a {
          padding-bottom: 1px;
          color: #263c32;
          border-bottom: 1px solid rgba(182, 139, 85, 0.55);
          font-weight: 800;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .auth-switch a:hover {
          color: #b68b55;
        }

        .auth-terms {
          margin: 14px 0 0;
          color: #a3a8a2;
          font-size: 9.5px;
          line-height: 1.6;
          text-align: center;
        }

        /* ---------- RESPONSIVE ---------- */

        @media (max-width: 900px) {
          .auth-shell {
            grid-template-columns: 1fr;
            width: min(560px, 100%);
          }

          .auth-aside {
            min-height: 0;
            gap: 22px;
            padding: 30px 30px 26px;
          }

          .auth-aside-title {
            max-width: 430px;
            font-size: 33px;
          }

          .auth-aside-copy,
          .auth-perks,
          .auth-quote {
            display: none;
          }

          .auth-panel {
            padding: 34px 34px 32px;
          }
        }

        @media (max-width: 850px) {
          .auth-page {
            min-height: calc(100vh - 70px);
            min-height: calc(100dvh - 70px);
            padding: 24px 3% 34px;
          }
        }

        @media (max-width: 560px) {
          .auth-page {
            padding: 20px 14px 30px;
          }

          .auth-shell {
            border-radius: 22px;
          }

          .auth-aside {
            padding: 24px 23px 22px;
          }

          .auth-aside-title {
            font-size: 28px;
          }

          .auth-brand-icon {
            width: 39px;
            height: 39px;
          }

          .auth-brand-name {
            font-size: 20px;
          }

          .auth-panel {
            padding: 28px 22px 25px;
          }

          .auth-title {
            font-size: 26px;
          }

          .auth-input {
            height: 45px;
          }
        }
      `}</style>

      <div className="auth-orb auth-orb-one" aria-hidden="true" />
      <div className="auth-orb auth-orb-two" aria-hidden="true" />

      <main className="auth-shell">
        <aside className="auth-aside">
          <Link href="/" className="auth-brand" aria-label="BookNook home">
            <span className="auth-brand-icon">
              <BookOpen size={24} strokeWidth={2.2} />
            </span>

            <span>
              <span className="auth-brand-name">
                Book<span>Nook</span>
              </span>
              <small>YOUR LITTLE READING SPACE</small>
            </span>
          </Link>

          <div className="auth-aside-content">
            <span className="auth-eyebrow">
              <Sparkles size={12} />
              {copy.eyebrow}
            </span>

            <h1 className="auth-aside-title">{copy.asideTitle}</h1>

            <p className="auth-aside-copy">{copy.asideCopy}</p>

            <div className="auth-perks">
              {PERKS.map((perk) => {
                const Icon = perk.icon;

                return (
                  <span className="auth-perk" key={perk.label}>
                    <span className="auth-perk-icon">
                      <Icon size={13} />
                    </span>
                    {perk.label}
                  </span>
                );
              })}
            </div>
          </div>

          <p className="auth-quote">
            “A room without books is like a body without a soul.”{" "}
            <span>— Cicero</span>
          </p>
        </aside>

        <section className="auth-panel">
          <div className="auth-panel-head">
            <span className="auth-kicker">
              <span className="auth-kicker-dot" />
              {isSignup ? "NEW HERE?" : "WELCOME BACK"}
            </span>

            <h2 className="auth-title">{copy.formTitle}</h2>
            <p className="auth-subtitle">{copy.formSubtitle}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">
                Name
              </label>

              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="auth-input"
                  placeholder="Your name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email
              </label>

              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="auth-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
                {isSignup && <span>6+ characters</span>}
              </label>

              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="auth-input"
                  placeholder={isSignup ? "Create a password" : "Enter your password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  minLength={isSignup ? 6 : undefined}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />

                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-alert auth-alert-error" role="alert">
                <CircleAlert size={15} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-alert auth-alert-success" role="status">
                <CircleCheck size={15} />
                <span>{success}</span>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading || googleLoading}
            >
              <span>{loading ? copy.loading : copy.submit}</span>
              {loading ? (
                <LoaderCircle size={17} className="auth-spinner" />
              ) : (
                <ArrowRight size={16} />
              )}
            </button>
          </form>

          <div className="auth-divider">or continue with</div>

          <button
            type="button"
            className="auth-google"
            onClick={handleGoogle}
            disabled={loading || googleLoading}
          >
            {googleLoading ? (
              <LoaderCircle size={17} className="auth-spinner" />
            ) : (
              <GoogleMark />
            )}
            <span>{copy.google}</span>
          </button>

          <p className="auth-switch">
            {copy.switchText}{" "}
            <Link href={copy.switchHref}>{copy.switchLabel}</Link>
          </p>

          {isSignup && (
            <p className="auth-terms">
              By creating an account, you agree to keep BookNook a kind
              place for readers everywhere.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
