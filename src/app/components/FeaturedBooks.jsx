"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const categories = [
  "All Categories",
  "Fiction",
  "Non-Fiction",
  "Science",
  "Technology",
  "History",
  "Biography",
  "Romance",
  "Mystery",
  "Islamic",
  "Other",
];

export default function BooksSection({
  limit,
  showFilters = false,
  showHeading = true,
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/books`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load books.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Unable to load books.");
        }

        setBooks(Array.isArray(data.books) ? data.books : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Books Fetch Error:", err);
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => controller.abort();
  }, []);

  const filteredBooks = books.filter((book) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      book.bookName?.toLowerCase().includes(searchText) ||
      book.authorName?.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      book.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const displayedBooks = limit
    ? filteredBooks.slice(0, limit)
    : filteredBooks;

  return (
    <section className="bg-[#F7F4EC] px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1450px]">

        {/* Heading */}
        {showHeading && (
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-[#B84E2D] uppercase">
                <BookOpen size={17} />
                Our Collection
              </div>

              <h2 className="font-serif text-3xl font-semibold text-[#252722] sm:text-4xl lg:text-5xl">
                {showFilters ? "Explore All Books" : "All Books"}
                <span className="text-[#B84E2D]">.</span>
              </h2>

              <p className="mt-3 text-sm text-[#77766F] sm:text-base">
                Discover stories, ideas and knowledge from our growing
                collection.
              </p>
            </div>

            {!showFilters && (
              <Link
                href="/books"
                className="group inline-flex items-center gap-2 rounded-sm border border-[#D8D1C4] px-5 py-3 text-sm font-semibold text-[#252722] transition hover:border-[#B84E2D] hover:bg-[#B84E2D] hover:text-white"
              >
                View All Books
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            )}
          </div>
        )}

        {/* Search and Category */}
        {showFilters && (
          <div className="mb-10 flex flex-col gap-3 rounded-2xl border border-[#E7DFD1] bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-[#96958C]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by book name or author..."
                className="h-12 w-full rounded-xl border border-[#E7DFD1] bg-[#FAF9F6] pr-4 pl-12 text-sm text-[#252722] outline-none transition focus:border-[#B84E2D]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 rounded-xl border border-[#E7DFD1] bg-[#FAF9F6] px-4 text-sm text-[#252722] outline-none focus:border-[#B84E2D] sm:w-56"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center gap-3 text-[#77766F]">
            <Loader2 className="animate-spin" size={23} />
            Loading books...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle
              className="mx-auto mb-3 text-red-500"
              size={30}
            />

            <p className="font-semibold text-red-700">
              Could not load books
            </p>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <p className="mt-2 text-xs text-red-500">
              Make sure your backend is running on port 8000.
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && displayedBooks.length > 0 && (
          <>
            <p className="mb-5 text-sm text-[#77766F]">
              Showing{" "}
              <span className="font-semibold text-[#252722]">
                {displayedBooks.length}
              </span>{" "}
              books
            </p>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">

              {displayedBooks.map((book) => {
                const bookId = book._id?.toString();

                if (!bookId) return null;

                return (
                  <article
                    key={bookId}
                    className="group overflow-hidden rounded-xl border border-[#E8E0D3] bg-white transition-all duration-300 hover:-translate-y-2 hover:border-[#C99B76] hover:shadow-xl"
                  >
                    {/* Book Cover */}
                    <Link
                      href={`/books/${bookId}`}
                      aria-label={`View ${book.bookName} details`}
                      className="block"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#EEEAE1]">

                        {book.imageUrl ? (
                          <Image
                            src={book.imageUrl}
                            alt={book.bookName || "Book cover"}
                            fill
                            unoptimized
                            sizes="(max-width: 640px) 50vw, 20vw"
                            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <BookOpen
                              size={40}
                              className="text-[#B84E2D]"
                            />
                          </div>
                        )}

                        <span className="absolute top-3 left-3 rounded-full bg-white px-3 py-1 text-[9px] font-bold tracking-wide text-[#B84E2D] uppercase shadow-sm sm:text-[10px]">
                          {book.category || "Other"}
                        </span>
                      </div>
                    </Link>

                    {/* Book Information */}
                    <div className="p-3 sm:p-4">
                      <h3 className="line-clamp-2 font-serif text-base font-bold text-[#252722] transition-colors group-hover:text-[#B84E2D] sm:text-lg">
                        {book.bookName}
                      </h3>

                      <p className="mt-2 truncate text-xs text-[#77766F] sm:text-sm">
                        By {book.authorName}
                      </p>

                      {/* View Details */}
                      <div className="mt-4 flex items-center justify-between border-t border-[#EEEAE1] pt-3">

                        <Link
                          href={`/books/${bookId}`}
                          className="text-xs font-bold text-[#B84E2D] transition-colors hover:text-[#233B30] sm:text-sm"
                        >
                          View Details
                        </Link>

                        <ArrowRight
                          size={16}
                          className="text-[#B84E2D] transition-transform group-hover:translate-x-1"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}

            </div>
          </>
        )}

        {/* Empty */}
        {!loading && !error && displayedBooks.length === 0 && (
          <div className="rounded-xl border border-dashed border-[#D8D1C4] bg-white py-16 text-center">
            <BookOpen
              size={38}
              className="mx-auto mb-4 text-[#B84E2D]"
            />

            <h3 className="font-serif text-xl font-semibold text-[#252722]">
              No Books Found
            </h3>

            <p className="mt-2 text-sm text-[#77766F]">
              Try another search or select a different category.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}