"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getUploadTime = (book) => {
  if (book.createdAt) return new Date(book.createdAt).getTime();

  // createdAt না থাকলে MongoDB ObjectId থেকে সময় নেওয়া হবে
  if (book._id && /^[a-f\d]{24}$/i.test(book._id)) {
    return parseInt(book._id.substring(0, 8), 16) * 1000;
  }

  return 0;
};

export default function RecentlyUploaded() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const response = await fetch(`${API_URL}/books`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const result = await response.json();

        const allBooks = Array.isArray(result)
          ? result
          : result.books || [];

        const sortedBooks = [...allBooks]
          .sort((a, b) => getUploadTime(b) - getUploadTime(a))
          .slice(0, 8);

        setBooks(sortedBooks);
      } catch (error) {
        console.error("Recently uploaded books error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBooks();
  }, []);

  return (
    <section className="recent-section">
      <div className="recent-container">

        {/* Section Heading */}
        <div className="recent-heading">
          <div>
            <div className="recent-label">
              <Clock3 size={15} />
              <span>FRESH FROM OUR LIBRARY</span>
            </div>

            <h2>
              Recently <span>Uploaded.</span>
            </h2>

            <p>
              Discover the latest books added to our collection.
            </p>
          </div>

          <Link href="/books" className="recent-view-all">
            Explore All Books
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="recent-grid">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="recent-skeleton" key={index}>
                <div className="skeleton-image" />
                <div className="skeleton-line" />
                <div className="skeleton-line small" />
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="recent-grid">
            {books.map((book) => (
              <article className="recent-card" key={book._id}>
                <Link
                  href={`/books/${book._id}`}
                  className="recent-image-wrapper"
                >
                  <Image
                    src={book.imageUrl || "https://placehold.co/600x800?text=Book"}
                    alt={book.bookName || "Book cover"}
                    width={600}
                    height={800}
                    className="recent-image"
                    unoptimized
                  />

                  <span className="recent-badge">
                    <Clock3 size={12} />
                    Recently Added
                  </span>
                </Link>

                <div className="recent-card-content">
                  <p className="recent-author">
                    {book.authorName || "Unknown Author"}
                  </p>

                  <h3>{book.bookName}</h3>

                  <div className="recent-card-bottom">
                    <span>
                      <BookOpen size={15} />
                      {book.totalCopies ?? 0} Copies
                    </span>

                    <Link href={`/books/${book._id}`}>
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="recent-empty">
            <BookOpen size={35} />
            <h3>No books uploaded yet</h3>
            <p>Newly uploaded books will appear here.</p>
          </div>
        )}
      </div>

      <style >{`
        .recent-section {
          padding: 85px 0;
          background: #f7f4ec;
        }

        .recent-container {
          width: min(1280px, 92%);
          margin: 0 auto;
        }

        .recent-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 20px;
          margin-bottom: 35px;
        }

        .recent-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #b84e2d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 12px;
        }

        .recent-heading h2 {
          color: #252722;
          font-size: clamp(30px, 4vw, 45px);
          font-weight: 800;
          letter-spacing: -1.8px;
          line-height: 1.1;
        }

        .recent-heading h2 span {
          color: #b84e2d;
        }

        .recent-heading p {
          color: #77766f;
          margin-top: 12px;
          font-size: 14px;
        }

        .recent-view-all {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #252722;
          font-size: 13px;
          font-weight: 700;
          padding: 13px 18px;
          border: 1px solid #e8e0d3;
          border-radius: 12px;
          transition: 0.3s;
          white-space: nowrap;
        }

        .recent-view-all:hover {
          background: #252722;
          color: #f7f4ec;
          border-color: #252722;
        }

        .recent-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .recent-card {
          background: #fffefa;
          border: 1px solid #e8e0d3;
          border-radius: 18px;
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .recent-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 18px 40px rgba(37, 39, 34, 0.09);
        }

        .recent-image-wrapper {
          display: block;
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #eee9df;
        }

        .recent-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .recent-card:hover .recent-image {
          transform: scale(1.06);
        }

        .recent-badge {
          position: absolute;
          top: 13px;
          left: 13px;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 7px 10px;
          background: rgba(247, 244, 236, 0.94);
          color: #b84e2d;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
        }

        .recent-card-content {
          padding: 19px;
        }

        .recent-author {
          color: #b84e2d;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .recent-card-content h3 {
          color: #252722;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.4;
          min-height: 48px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .recent-card-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          padding-top: 14px;
          border-top: 1px solid #eee8dd;
        }

        .recent-card-bottom span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #77766f;
          font-size: 11px;
        }

        .recent-card-bottom a {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #252722;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .recent-card-bottom a:hover {
          color: #b84e2d;
        }

        .recent-skeleton {
          padding: 12px;
          border-radius: 18px;
          background: #fffefa;
          border: 1px solid #e8e0d3;
        }

        .skeleton-image {
          height: 240px;
          border-radius: 12px;
          background: #e9e5dc;
          animation: pulse 1.3s infinite alternate;
        }

        .skeleton-line {
          height: 13px;
          width: 85%;
          margin-top: 18px;
          border-radius: 5px;
          background: #e9e5dc;
          animation: pulse 1.3s infinite alternate;
        }

        .skeleton-line.small {
          width: 55%;
          margin-top: 10px;
        }

        .recent-empty {
          text-align: center;
          padding: 60px 20px;
          color: #77766f;
        }

        .recent-empty svg {
          margin: 0 auto 15px;
        }

        .recent-empty h3 {
          color: #252722;
          font-size: 20px;
          font-weight: 800;
        }

        .recent-empty p {
          margin-top: 7px;
          font-size: 13px;
        }

        @keyframes pulse {
          from { opacity: 0.5; }
          to { opacity: 1; }
        }

        @media (max-width: 1024px) {
          .recent-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .recent-section {
            padding: 55px 0;
          }

          .recent-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .recent-grid {
            gap: 13px;
          }

          .recent-image-wrapper {
            height: 190px;
          }

          .recent-card-content {
            padding: 12px;
          }

          .recent-card-content h3 {
            font-size: 14px;
          }

          .recent-card-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .recent-badge {
            font-size: 9px;
            padding: 6px 7px;
          }
        }
      `}</style>
    </section>
  );
}