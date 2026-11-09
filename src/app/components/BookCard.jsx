import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function BookCard({ book }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-[#E8E1D5] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#D9B69E] hover:shadow-[0_15px_40px_rgba(37,39,34,0.09)]">

      {/* BOOK IMAGE */}
      <Link
        href={`/books/${book._id}`}
        className="relative block overflow-hidden bg-[#F3F0E9]"
      >
        <div className="flex h-[260px] items-center justify-center p-5 sm:h-[280px]">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.bookName}
              className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <BookOpen size={50} className="text-[#B84E2D]" />
          )}
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#B84E2D] shadow-sm backdrop-blur">
          {book.category || "General"}
        </span>
      </Link>

      {/* BOOK INFORMATION */}
      <div className="p-5">
        <Link href={`/books/${book._id}`}>
          <h3 className="line-clamp-1 font-serif text-xl font-semibold text-[#252722] transition-colors group-hover:text-[#B84E2D]">
            {book.bookName}
          </h3>
        </Link>

        <p className="mt-2 line-clamp-1 text-sm text-[#77776D]">
          By {book.authorName}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[#EEE9E0] pt-4">
          <span className="text-xs text-[#999589]">
            {book.totalCopies ?? 0} Copies
          </span>

          <Link
            href={`/books/${book._id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#B84E2D] transition-all hover:gap-2"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}