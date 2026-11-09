"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Loader2,
  RotateCcw,
} from "lucide-react";

export default function MyBorrowsPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [error, setError] = useState("");

  async function fetchBorrows() {
    try {
      const response = await fetch("/api/my-borrows", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }

      setBorrows(data.borrows || []);
    } catch (err) {
      setError(err.message || "Failed to load borrowed books.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadBorrows() {
      await fetchBorrows();
    }

    loadBorrows();
  }, []);

  async function handleReturn(borrowId) {
    if (!window.confirm("Are you sure you want to return this book?")) {
      return;
    }

    setReturningId(borrowId);
    setError("");

    try {
      const response = await fetch("/api/borrow/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ borrowId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchBorrows();
    } catch (err) {
      setError(err.message || "Failed to return book.");
    } finally {
      setReturningId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-3 bg-[#F7F4EC] text-[#77766F]">
        <Loader2 className="animate-spin" />
        Loading your borrowed books...
      </div>
    );
  }

  const activeBorrows = borrows.filter(
    (item) => item.status === "borrowed"
  );

  const returnedBorrows = borrows.filter(
    (item) => item.status === "returned"
  );

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-14 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1250px]">

        <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#B84E2D]">
          Your Reading Collection
        </p>

        <h1 className="font-serif text-4xl font-bold text-[#252722] sm:text-5xl">
          My Borrows<span className="text-[#B84E2D]">.</span>
        </h1>

        <p className="mt-3 text-sm text-[#77766F]">
          Manage your borrowed books and return them whenever you finish reading.
        </p>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E8E0D3] bg-white p-6">
            <p className="text-sm text-[#77766F]">Currently Borrowed</p>
            <h2 className="mt-2 text-3xl font-bold text-[#B84E2D]">
              {activeBorrows.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E8E0D3] bg-white p-6">
            <p className="text-sm text-[#77766F]">Returned Books</p>
            <h2 className="mt-2 text-3xl font-bold text-[#252722]">
              {returnedBorrows.length}
            </h2>
          </div>
        </div>

        <h2 className="mt-12 mb-6 font-serif text-2xl font-bold text-[#252722]">
          Currently Borrowed
        </h2>

        {activeBorrows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D8D1C4] bg-white p-12 text-center">
            <BookOpen size={38} className="mx-auto text-[#B84E2D]" />

            <h3 className="mt-4 font-serif text-xl font-bold text-[#252722]">
              No Borrowed Books
            </h3>

            <p className="mt-2 text-sm text-[#77766F]">
              You have not borrowed any books yet.
            </p>

            <Link
              href="/books"
              className="mt-6 inline-flex rounded-xl bg-[#B84E2D] px-6 py-3 text-sm font-bold text-white hover:bg-[#963C22]"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {activeBorrows.map((item) => (
              <article
                key={item._id}
                className="overflow-hidden rounded-xl border border-[#E8E0D3] bg-white"
              >
                <div className="relative aspect-[3/4] bg-[#EEEAE1]">
                  {item.book?.imageUrl && (
                    <Image
                      src={item.book.imageUrl}
                      alt={item.book.bookName || "Book cover"}
                      fill
                      unoptimized
                      className="object-contain p-3"
                    />
                  )}
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 font-serif font-bold text-[#252722]">
                    {item.book?.bookName || "Book no longer available"}
                  </h3>

                  <p className="mt-2 text-xs text-[#77766F]">
                    By {item.book?.authorName || "Unknown"}
                  </p>

                  <p className="mt-3 text-xs text-[#77766F]">
                    Borrowed:{" "}
                    {new Date(item.borrowedAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => handleReturn(item._id)}
                    disabled={returningId === item._id}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#B84E2D] px-3 py-3 text-xs font-bold text-white transition hover:bg-[#963C22] disabled:opacity-60"
                  >
                    {returningId === item._id ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <RotateCcw size={15} />
                    )}
                    Return Book
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {returnedBorrows.length > 0 && (
          <>
            <h2 className="mt-14 mb-6 font-serif text-2xl font-bold text-[#252722]">
              Returned Books
            </h2>

            <div className="space-y-3">
              {returnedBorrows.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8E0D3] bg-white p-5"
                >
                  <div>
                    <h3 className="font-semibold text-[#252722]">
                      {item.book?.bookName || "Book"}
                    </h3>

                    <p className="mt-1 text-xs text-[#77766F]">
                      Returned:{" "}
                      {item.returnedAt
                        ? new Date(item.returnedAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                    Returned
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </main>
  );
}