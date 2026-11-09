"use client";

import Link from "next/link";
import {
  BookOpen,
  Brain,
  Atom,
  Laptop,
  Landmark,
  UserRound,
  Heart,
  Compass,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Stories that spark imagination.",
    icon: BookOpen,
    number: "01",
  },
  {
    name: "Non-Fiction",
    description: "Real stories and real knowledge.",
    icon: Brain,
    number: "02",
  },
  {
    name: "Science",
    description: "Explore the wonders of science.",
    icon: Atom,
    number: "03",
  },
  {
    name: "Technology",
    description: "Discover the future of innovation.",
    icon: Laptop,
    number: "04",
  },
  {
    name: "History",
    description: "Travel through time and history.",
    icon: Landmark,
    number: "05",
  },
  {
    name: "Biography",
    description: "Learn from extraordinary lives.",
    icon: UserRound,
    number: "06",
  },
  {
    name: "Romance",
    description: "Stories of love and emotions.",
    icon: Heart,
    number: "07",
  },
  {
    name: "Islamic",
    description: "Knowledge, faith and spirituality.",
    icon: Compass,
    number: "08",
  },
];

export default function ExploreCategories() {
  return (
    <section className="categories-section">
      <div className="categories-container">

        {/* Heading */}
        <div className="categories-heading">
          <div>
            <span className="categories-eyebrow">
              <span className="eyebrow-dot" />
              FIND YOUR NEXT READ
            </span>

            <h2>
              Explore by <span>Category.</span>
            </h2>

            <p>
              Every great journey begins with a book.
              Find the perfect one for your next adventure.
            </p>
          </div>

          <Link href="/books" className="all-categories-btn">
            Browse All Books
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href={`/books?category=${encodeURIComponent(category.name)}`}
                key={category.name}
                className="category-card"
              >
                <div className="category-top">
                  <span className="category-number">
                    {category.number}
                  </span>

                  <span className="category-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                </div>

                <div className="category-icon">
                  <Icon size={27} strokeWidth={1.7} />
                </div>

                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>

                <div className="category-bottom-line" />
              </Link>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="categories-bottom">
          <span>8 CATEGORIES</span>
          <span className="bottom-divider" />
          <span>ENDLESS POSSIBILITIES</span>
        </div>
      </div>

      <style >{`
        .categories-section {
          background: #252722;
          padding: 95px 0;
          overflow: hidden;
        }

        .categories-container {
          width: min(1280px, 92%);
          margin: 0 auto;
        }

        .categories-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 42px;
        }

        .categories-eyebrow {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #ceaa78;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 17px;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #b84e2d;
          box-shadow: 0 0 12px #b84e2d;
        }

        .categories-heading h2 {
          color: #f7f4ec;
          font-size: clamp(32px, 4vw, 48px);
          font-weight: 800;
          letter-spacing: -2px;
          line-height: 1.1;
        }

        .categories-heading h2 span {
          color: #ceaa78;
        }

        .categories-heading p {
          color: #aaa99f;
          font-size: 14px;
          line-height: 1.8;
          max-width: 470px;
          margin-top: 15px;
        }

        .all-categories-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 19px;
          border: 1px solid #55564e;
          border-radius: 10px;
          color: #f7f4ec;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .all-categories-btn:hover {
          background: #ceaa78;
          border-color: #ceaa78;
          color: #252722;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .category-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-height: 230px;
          padding: 22px;
          border: 1px solid #44463f;
          border-radius: 15px;
          background: #2c2e28;
          overflow: hidden;
          transition: all 0.35s ease;
        }

        .category-card:hover {
          background: #34362e;
          border-color: #ceaa78;
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }

        .category-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .category-number {
          color: #77786e;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .category-arrow {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid #505149;
          border-radius: 50%;
          color: #aaa99f;
          transition: all 0.3s ease;
        }

        .category-card:hover .category-arrow {
          background: #ceaa78;
          border-color: #ceaa78;
          color: #252722;
          transform: rotate(45deg);
        }

        .category-icon {
          display: grid;
          place-items: center;
          width: 53px;
          height: 53px;
          margin-top: 24px;
          border-radius: 13px;
          background: rgba(206, 170, 120, 0.1);
          color: #ceaa78;
          transition: all 0.3s ease;
        }

        .category-card:hover .category-icon {
          background: #ceaa78;
          color: #252722;
          transform: scale(1.08);
        }

        .category-info {
          margin-top: 19px;
        }

        .category-info h3 {
          color: #f7f4ec;
          font-size: 19px;
          font-weight: 800;
        }

        .category-info p {
          color: #999a90;
          font-size: 12px;
          margin-top: 7px;
          line-height: 1.6;
        }

        .category-bottom-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 3px;
          background: #b84e2d;
          transition: width 0.4s ease;
        }

        .category-card:hover .category-bottom-line {
          width: 100%;
        }

        .categories-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          margin-top: 35px;
          color: #77786e;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .bottom-divider {
          width: 30px;
          height: 1px;
          background: #77786e;
        }

        @media (max-width: 900px) {
          .categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 600px) {
          .categories-section {
            padding: 65px 0;
          }

          .categories-heading {
            flex-direction: column;
            align-items: flex-start;
            gap: 22px;
          }

          .categories-heading h2 {
            letter-spacing: -1.3px;
          }

          .categories-grid {
            gap: 12px;
          }

          .category-card {
            min-height: 205px;
            padding: 15px;
          }

          .category-icon {
            width: 45px;
            height: 45px;
            margin-top: 20px;
          }

          .category-info h3 {
            font-size: 16px;
          }

          .category-info p {
            font-size: 11px;
          }

          .categories-bottom {
            font-size: 8px;
            letter-spacing: 1px;
          }
        }
      `}</style>
    </section>
  );
}