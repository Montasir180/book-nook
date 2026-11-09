import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  UserRound,
  Library,
  BookMarked,
  CheckCircle2,
} from "lucide-react";

import BorrowButton from "./BorrowButton";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Fetch Book From Backend
async function getBook(id) {
  try {
    const response = await fetch(
      `${API_URL}/books/${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Backend Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !data.book) {
      return null;
    }

    return data.book;

  } catch (error) {
    console.error("Book Fetch Error:", error);
    throw error;
  }
}

// SEO Metadata
export async function generateMetadata({ params }) {
  const { id } = await params;

  const book = await getBook(id);

  if (!book) {
    return {
      title: "Book Not Found | BookNook",
    };
  }

  return {
    title: `${book.bookName} | BookNook`,
    description: book.description || "Explore books on BookNook.",
  };
}

// Main Details Page
export default async function BookDetailsPage({ params }) {
  const { id } = await params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }

  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const availableCopies = Math.max(
    0,
    Number(book.totalCopies) || 0
  );

  return (
    <main className="min-h-screen bg-[#F7F4EC] px-5 py-10 sm:px-8 lg:px-12">

      <div className="mx-auto max-w-[1250px]">

        {/* Back Button */}
        <Link
          href="/books"
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-[#77766F] transition hover:text-[#B84E2D]"
        >
          <ArrowLeft size={17} />
          Back to All Books
        </Link>

        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

          {/* Book Image */}
          <div className="relative mx-auto w-full max-w-[420px]">

            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#E8E0D3] bg-white p-5 shadow-[0_20px_60px_rgba(37,39,34,0.08)]">

              {book.imageUrl ? (
                <Image
                  src={book.imageUrl}
                  alt={book.bookName || "Book Cover"}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-contain p-5"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-[#B84E2D]">
                  <BookOpen size={65} />
                  <p className="mt-4 font-serif text-lg">
                    No Cover Available
                  </p>
                </div>
              )}

            </div>

            {/* Availability */}
            <div className="absolute -right-3 -top-3 rounded-full border border-[#E8E0D3] bg-white px-4 py-2 shadow-md">

              <span
                className={`text-xs font-bold ${
                  availableCopies > 0
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {availableCopies > 0
                  ? "Available"
                  : "Out of Stock"}
              </span>

            </div>

          </div>

          {/* Book Information */}
          <div className="pt-2">

            {/* Category */}
            <div className="mb-5 flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-[#B84E2D]/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#B84E2D]">
                {book.category || "Uncategorized"}
              </span>

              <span className="text-xs font-medium text-[#99958C]">
                BookNook Collection
              </span>

            </div>

            {/* Title */}
            <h1 className="max-w-[750px] font-serif text-4xl leading-tight font-bold text-[#252722] sm:text-5xl lg:text-6xl">
              {book.bookName}
              <span className="text-[#B84E2D]">.</span>
            </h1>

            {/* Author */}
            <div className="mt-5 flex items-center gap-2 text-[#77766F]">

              <UserRound size={19} />

              <p className="text-sm">
                Written by{" "}
                <span className="font-semibold text-[#252722]">
                  {book.authorName || "Unknown Author"}
                </span>
              </p>

            </div>

            {/* Description */}
            <div className="mt-9 border-t border-[#E8E0D3] pt-7">

              <h2 className="mb-3 font-serif text-xl font-bold text-[#252722]">
                About This Book
              </h2>

              <p className="text-sm leading-8 text-[#77766F] sm:text-base">
                {book.description ||
                  "No description available for this book."}
              </p>

            </div>

            {/* Information Cards */}
            <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-[#E8E0D3] bg-white p-4">

                <CalendarDays size={20} className="text-[#B84E2D]" />

                <p className="mt-3 text-xs text-[#99958C]">
                  Published Year
                </p>

                <p className="mt-1 font-bold text-[#252722]">
                  {book.publishedYear || "N/A"}
                </p>

              </div>

              <div className="rounded-xl border border-[#E8E0D3] bg-white p-4">

                <BookMarked size={20} className="text-[#B84E2D]" />

                <p className="mt-3 text-xs text-[#99958C]">
                  Category
                </p>

                <p className="mt-1 font-bold text-[#252722]">
                  {book.category || "Other"}
                </p>

              </div>

              <div className="rounded-xl border border-[#E8E0D3] bg-white p-4">

                <Library size={20} className="text-[#B84E2D]" />

                <p className="mt-3 text-xs text-[#99958C]">
                  Available Copies
                </p>

                <p
                  className={`mt-1 font-bold ${
                    availableCopies > 0
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >
                  {availableCopies}
                </p>

              </div>

            </div>

            {/* Owner */}
            <div className="mt-7 flex items-center gap-3 rounded-xl border border-[#E8E0D3] bg-white p-4">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#B84E2D]/10 text-[#B84E2D]">
                <UserRound size={21} />
              </div>

              <div>
                <p className="text-xs text-[#99958C]">
                  Book Contributed By
                </p>

                <p className="mt-1 text-sm font-bold text-[#252722]">
                  {book.ownerName || "BookNook Community"}
                </p>
              </div>

            </div>

            {/* Borrow Section */}
            <div className="mt-9 border-t border-[#E8E0D3] pt-7">

              <div className="flex items-center gap-2 text-sm font-semibold text-[#252722]">
                <CheckCircle2
                  size={18}
                  className="text-[#B84E2D]"
                />
                Ready to start reading?
              </div>

              <p className="mt-2 text-sm leading-6 text-[#77766F]">
                Borrow this book and enjoy your next reading experience with BookNook.
              </p>

              <BorrowButton
                bookId={book._id.toString()}
                totalCopies={availableCopies}
              />

            </div>

          </div>

        </div>

        {/* Bottom Navigation */}
        <div className="mt-20 border-t border-[#E8E0D3] pt-8">

          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#B84E2D] transition hover:gap-3"
          >
            <ArrowLeft size={17} />
            Explore More Books
          </Link>

        </div>

      </div>

    </main>
  );
}