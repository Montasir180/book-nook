
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  BookOpen,
  Menu,
  X,
  Home,
  Library,
  Plus,
  Bookmark,
  BookMarked,
  ArrowUpRight,
  LogOut,
} from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [mobileMenu, setMobileMenu] = useState(false);

  const user = session?.user;

  const navLinks = [
    { name: "Home", href: "/", icon: Home },
    { name: "All Books", href: "/books", icon: Library },
    { name: "Add Book", href: "/add-book", icon: Plus },
    { name: "My Books", href: "/my-books", icon: Bookmark },
    { name: "My Borrows", href: "/my-borrows", icon: BookMarked },
  ];

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "BN";

  const isActive = (href) => {
    if (href === "/") return pathname === "/";

    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleSignOut = async () => {
    try {
      setMobileMenu(false);

      await signOut();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <>
      <style >{`

        /* ==========================
           BOOKNOOK GLASS NAVBAR
        ========================== */

        .navbar-wrapper {
          position: sticky;
          top: 12px;
          z-index: 999;
          width: 100%;
          padding: 0 4%;
        }

        .booknook-navbar {
          max-width: 1450px;
          min-height: 76px;
          margin: auto;
          padding: 0 25px;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;

          background: rgba(255, 255, 255, 0.76);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);

          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 22px;

          box-shadow:
            0 8px 32px rgba(31, 38, 45, 0.07),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);

          transition: all 0.35s ease;
        }

        .booknook-navbar:hover {
          box-shadow: 0 12px 40px rgba(31, 38, 45, 0.11);
        }

        /* LOGO */

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 11px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-icon {
          width: 45px;
          height: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: white;
          background: #263c32;
          border-radius: 14px;

          transition: all 0.4s ease;
        }

        .navbar-logo:hover .logo-icon {
          transform: rotate(-8deg) scale(1.08);
          background: #b68b55;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .logo-text > span {
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -1px;
          color: #263c32;
        }

        .logo-highlight {
          color: #b68b55;
        }

        .logo-text small {
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1.4px;
          color: #858b84;
        }

        /* DESKTOP NAVIGATION */

        .desktop-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px;

          background: rgba(240, 241, 235, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 15px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 7px;

          padding: 11px 12px;

          color: #687169;
          text-decoration: none;

          font-size: 12px;
          font-weight: 650;

          border-radius: 11px;
          white-space: nowrap;

          transition: all 0.3s ease;
        }

        .nav-link:hover {
          color: #263c32;
          background: rgba(255, 255, 255, 0.9);
          transform: translateY(-2px);
        }

        .nav-link.active {
          color: white;
          background: #263c32;
          box-shadow: 0 4px 12px rgba(38, 60, 50, 0.18);
        }

        /* RIGHT SIDE ACTIONS */

        .navbar-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
          flex-shrink: 0;
        }

        .auth-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .signin-btn,
        .signup-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;

          padding: 12px 16px;

          border-radius: 11px;
          text-decoration: none;

          font-size: 12px;
          font-weight: 750;
          white-space: nowrap;

          transition: all 0.3s ease;
        }

        /* SIGN IN */

        .signin-btn {
          color: #263c32;
          background: rgba(255, 255, 255, 0.75);

          border: 1px solid rgba(38, 60, 50, 0.16);
        }

        .signin-btn:hover {
          background: #f0f1eb;
          border-color: #263c32;
          transform: translateY(-2px);
        }

        /* SIGN UP */

        .signup-btn {
          color: white;
          background: #263c32;
          border: 1px solid #263c32;
        }

        .signup-btn:hover {
          background: #b68b55;
          border-color: #b68b55;
          transform: translateY(-3px);

          box-shadow: 0 8px 20px rgba(182, 139, 85, 0.22);
        }

        .auth-icon {
          transition: transform 0.3s ease;
        }

        .signup-btn:hover .auth-icon {
          transform: translate(3px, -3px);
        }

        /* SIGNED IN ACCOUNT */

        .nav-account {
          display: flex;
          align-items: center;
          gap: 9px;

          padding: 5px 7px;

          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(38, 60, 50, 0.1);
          border-radius: 13px;
        }

        .nav-avatar {
          width: 37px;
          height: 37px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: white;
          background: #263c32;
          border-radius: 10px;

          font-size: 11px;
          font-weight: 800;
        }

        .nav-user-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .nav-user-text span {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          color: #263c32;
          font-size: 12px;
          font-weight: 750;
        }

        .nav-user-text small {
          color: #9aa199;
          font-size: 8px;
          font-weight: 700;
        }

        .nav-signout {
          width: 33px;
          height: 33px;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #7b857c;
          background: transparent;
          border: 0;
          border-radius: 9px;

          cursor: pointer;
          transition: all 0.25s ease;
        }

        .nav-signout:hover {
          color: #b04b3b;
          background: #f8ece8;
        }

        /* MOBILE MENU BUTTON */

        .mobile-menu-btn {
          display: none;

          width: 40px;
          height: 40px;

          align-items: center;
          justify-content: center;

          border: 1px solid rgba(38, 60, 50, 0.12);
          border-radius: 11px;

          background: rgba(255, 255, 255, 0.7);
          color: #263c32;

          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
          background: #263c32;
          color: white;
        }

        /* MOBILE NAVIGATION */

        .mobile-nav {
          display: none;
        }

        .mobile-nav-inner {
          padding: 15px;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 13px;

          padding: 14px;
          margin-bottom: 6px;

          color: #58645b;
          text-decoration: none;

          font-size: 14px;
          font-weight: 650;

          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover,
        .mobile-nav-link.active {
          background: #263c32;
          color: white;
        }

        .mobile-link-arrow {
          margin-left: auto;
          opacity: 0.6;
        }

        /* MOBILE ACCOUNT */

        .mobile-account {
          margin-top: 12px;
          padding-top: 14px;
          border-top: 1px solid rgba(38, 60, 50, 0.1);
        }

        .mobile-user {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 5px 6px 14px;
        }

        .mobile-user-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }

        .mobile-user-info span {
          color: #263c32;
          font-size: 13px;
          font-weight: 750;
        }

        .mobile-user-info small {
          color: #8b938c;
          font-size: 10px;
          overflow-wrap: anywhere;
        }

        .mobile-signout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;

          width: 100%;
          padding: 13px;

          color: #a94438;
          background: #fdf3f1;

          border: 1px solid rgba(176, 75, 59, 0.18);
          border-radius: 12px;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
        }

        /* RESPONSIVE */

        @media (max-width: 1150px) {
          .navbar-wrapper {
            padding: 0 2%;
          }

          .booknook-navbar {
            padding: 0 16px;
            gap: 8px;
          }

          .nav-link {
            padding: 10px 8px;
            font-size: 11px;
            gap: 5px;
          }

          .signin-btn,
          .signup-btn {
            padding: 11px 12px;
          }
        }

        @media (max-width: 950px) {
          .navbar-wrapper {
            top: 8px;
            padding: 0 3%;
          }

          .booknook-navbar {
            min-height: 68px;
            padding: 0 13px;
            border-radius: 17px;
          }

          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: flex;
          }

          .navbar-right {
            gap: 8px;
          }

          .mobile-nav {
            display: block;

            position: absolute;
            top: calc(100% + 10px);
            left: 3%;
            right: 3%;

            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);

            border: 1px solid rgba(255, 255, 255, 0.9);
            border-radius: 19px;

            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.1);

            opacity: 0;
            visibility: hidden;

            transform: translateY(-12px) scale(0.98);

            transition: all 0.3s ease;
            pointer-events: none;
          }

          .mobile-nav-open {
            opacity: 1;
            visibility: visible;

            transform: translateY(0) scale(1);
            pointer-events: auto;
          }

          .mobile-nav-open .mobile-nav-link {
            animation: mobileLinkEnter 0.35s ease both;
            animation-delay: calc(var(--i) * 0.05s);
          }

          @keyframes mobileLinkEnter {
            from {
              opacity: 0;
              transform: translateX(-12px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }

        @media (max-width: 480px) {
          .navbar-wrapper {
            padding: 0 2%;
          }

          .booknook-navbar {
            padding: 0 10px;
            gap: 5px;
          }

          .logo-icon {
            width: 37px;
            height: 37px;
          }

          .logo-text > span {
            font-size: 19px;
          }

          .logo-text small {
            font-size: 6px;
            letter-spacing: 0.8px;
          }

          .auth-actions {
            gap: 5px;
          }

          .signin-btn,
          .signup-btn {
            padding: 9px 10px;
            font-size: 10px;
            gap: 4px;
            border-radius: 9px;
          }

          .auth-icon {
            width: 13px;
            height: 13px;
          }

          .navbar-right {
            gap: 5px;
          }

          .mobile-menu-btn {
            width: 36px;
            height: 36px;
          }

          .nav-account {
            padding: 4px;
          }

          .nav-user-text {
            display: none;
          }
        }

        @media (max-width: 360px) {
          .logo-text small {
            display: none;
          }

          .logo-text > span {
            font-size: 17px;
          }

          .logo-icon {
            width: 34px;
            height: 34px;
          }

          .signin-btn,
          .signup-btn {
            padding: 8px 7px;
            font-size: 9px;
          }

          .mobile-menu-btn {
            width: 33px;
            height: 33px;
          }
        }

      `}</style>

      <header className="navbar-wrapper">

        <nav className="booknook-navbar">

          {/* LOGO */}

          <Link href="/" className="navbar-logo">

            <div className="logo-icon">
              <BookOpen size={24} strokeWidth={2.2} />
            </div>

            <div className="logo-text">
              <span>
                Book<span className="logo-highlight">Nook</span>
              </span>

              <small>YOUR LITTLE READING SPACE</small>
            </div>

          </Link>

          {/* DESKTOP NAVIGATION */}

          <div className="desktop-nav">

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`nav-link ${
                    isActive(link.href) ? "active" : ""
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.name}</span>
                </Link>
              );
            })}

          </div>

          {/* RIGHT SIDE */}

          <div className="navbar-right">

            {!isPending && !user && (
              <div className="auth-actions">

                <Link href="/login" className="signin-btn">
                  Sign In
                </Link>

                <Link href="/signup" className="signup-btn">
                  Sign Up

                  <ArrowUpRight
                    size={15}
                    className="auth-icon"
                  />
                </Link>

              </div>
            )}

            {!isPending && user && (
              <div className="nav-account">

                <div className="nav-avatar">
                  {initials}
                </div>

                <div className="nav-user-text">
                  <span>{user.name || "Reader"}</span>
                  <small>Signed in</small>
                </div>

                <button
                  type="button"
                  className="nav-signout"
                  onClick={handleSignOut}
                  aria-label="Sign out"
                  title="Sign out"
                >
                  <LogOut size={17} />
                </button>

              </div>
            )}

            {/* MOBILE MENU BUTTON */}

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>

          </div>

        </nav>

        {/* MOBILE NAVIGATION */}

        <div
          className={`mobile-nav ${
            mobileMenu ? "mobile-nav-open" : ""
          }`}
        >

          <div className="mobile-nav-inner">

            {navLinks.map((link, index) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenu(false)}
                  style={{ "--i": index }}
                  className={`mobile-nav-link ${
                    isActive(link.href) ? "active" : ""
                  }`}
                >
                  <Icon size={19} />

                  <span>{link.name}</span>

                  <ArrowUpRight
                    size={16}
                    className="mobile-link-arrow"
                  />
                </Link>
              );
            })}

            {user && (
              <div className="mobile-account">

                <div className="mobile-user">

                  <div className="nav-avatar">
                    {initials}
                  </div>

                  <div className="mobile-user-info">
                    <span>{user.name || "Reader"}</span>
                    <small>{user.email}</small>
                  </div>

                </div>

                <button
                  type="button"
                  className="mobile-signout"
                  onClick={handleSignOut}
                >
                  <LogOut size={17} />
                  Sign Out
                </button>

              </div>
            )}

          </div>

        </div>

      </header>
    </>
  );
}
