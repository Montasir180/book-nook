import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  User,
  Mail,
  CalendarDays,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  const initials = user.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-4 py-16 text-[#252722]">

      <div className="mx-auto max-w-3xl">

        <div className="mb-10 text-center">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#B84E2D]">
            Personal Account
          </p>

          <h1 className="text-4xl font-bold">
            My Profile
          </h1>

          <p className="mt-3 text-sm text-[#252722]/60">
            Manage your BookNook account information.
          </p>

        </div>

        <section className="rounded-3xl border border-[#E4DED2] bg-white/80 p-7 shadow-xl backdrop-blur-xl sm:p-10">

          {/* Avatar */}
          <div className="mb-8 flex flex-col items-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#252722] text-3xl font-bold text-[#F7F4EC]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials || <User size={35} />
              )}
            </div>

            <h2 className="mt-4 text-2xl font-bold">
              {user.name}
            </h2>

            <p className="mt-1 text-sm text-[#252722]/50">
              BookNook Member
            </p>

          </div>

          {/* User Details */}
          <div className="space-y-4">

            <div className="flex items-center gap-4 rounded-2xl bg-[#F7F4EC] p-5">

              <User className="text-[#B84E2D]" />

              <div>
                <p className="text-xs text-[#252722]/50">
                  Full Name
                </p>

                <p className="font-semibold">
                  {user.name}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#F7F4EC] p-5">

              <Mail className="text-[#B84E2D]" />

              <div>
                <p className="text-xs text-[#252722]/50">
                  Email Address
                </p>

                <p className="font-semibold">
                  {user.email}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#F7F4EC] p-5">

              <CalendarDays className="text-[#B84E2D]" />

              <div>
                <p className="text-xs text-[#252722]/50">
                  Joined
                </p>

                <p className="font-semibold">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-[#F7F4EC] p-5">

              <ShieldCheck className="text-[#B84E2D]" />

              <div>
                <p className="text-xs text-[#252722]/50">
                  Account Status
                </p>

                <p className="font-semibold text-green-700">
                  Active
                </p>
              </div>

            </div>

          </div>

          {/* Action */}
          <Link
            href="/"
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#B84E2D] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#963C22]"
          >
            <BookOpen size={18} />
            Explore Books
          </Link>

        </section>

      </div>

    </main>
  );
}