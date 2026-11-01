"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

// Hero background images
const slides = [
  "/hero1_img.png",
  "/hero2.png",
  "/hero_img_2.jpeg",
  "/hero_img_4.jpeg",
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  // Automatically change image every 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeSlide]);

  return (
    <section className="relative mx-3 mt-4 overflow-hidden rounded-lg sm:mx-5 lg:mx-8">

      {/* Background Images */}
      <div className="absolute inset-0">

        {slides.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === index
                ? "z-10 opacity-100"
                : "z-0 opacity-0"
            }`}
          >
            <Image
              src={image}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[4000ms] ease-out ${
                activeSlide === index
                  ? "scale-100"
                  : "scale-105"
              }`}
            />
          </div>
        ))}

      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#171B17]/90 via-[#171B17]/65 to-[#171B17]/20" />

      <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#171B17]/45 via-transparent to-transparent" />

      {/* Hero Content */}
      <div className="relative z-30 flex min-h-[450px] items-center px-5 py-10 sm:min-h-[470px] sm:px-10 sm:py-12 lg:min-h-[500px] lg:px-16">

        <div className="max-w-2xl">

          {/* Small Label */}
          <div className="mb-4 flex items-center gap-3">

            <span className="flex size-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[#F7F4EC] backdrop-blur-sm">
              <BookOpen size={17} />
            </span>

            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#E7B58E] uppercase sm:text-xs">
              A Small Online Library
            </span>

          </div>

          {/* Main Heading */}
          <h1 className="max-w-[600px] font-serif text-4xl leading-[1.08] font-medium tracking-[-0.045em] text-[#F7F4EC] sm:text-5xl lg:text-[62px]">

            Stories Worth
            <br />

            <span className="italic text-[#D99A72]">
              Keeping.
            </span>

            <br />

            Memories Forever.

          </h1>

          {/* Description */}
          <p className="mt-4 max-w-[450px] text-sm leading-6 text-white/75 sm:text-base">

            Discover beautiful stories, explore new ideas, and
            find your next favourite book. A little space for
            everyone who loves reading.

          </p>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">

            <Link
              href="/books"
              className="group inline-flex h-11 items-center gap-3 rounded-[4px] bg-[#B84E2D] px-5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#963C23] sm:h-12 sm:px-6"
            >
              Browse Books

              <ArrowRight
                size={17}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/add-book"
              className="inline-flex h-11 items-center rounded-[4px] border border-white/50 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white hover:text-[#252722] sm:h-12 sm:px-6"
            >
              Add Your Book
            </Link>

          </div>

          {/* Bottom Information - Desktop */}
          <div className="mt-7 hidden items-center gap-x-8 border-t border-white/20 pt-5 md:flex">

            <div>
              <p className="font-serif text-2xl text-white">
                Discover
              </p>
              <p className="mt-1 text-xs text-white/55">
                New stories
              </p>
            </div>

            <div className="h-9 w-px bg-white/20" />

            <div>
              <p className="font-serif text-2xl text-white">
                Borrow
              </p>
              <p className="mt-1 text-xs text-white/55">
                Favourite books
              </p>
            </div>

            <div className="h-9 w-px bg-white/20" />

            <div>
              <p className="font-serif text-2xl text-white">
                Share
              </p>
              <p className="mt-1 text-xs text-white/55">
                Your collection
              </p>
            </div>

          </div>

        </div>

        {/* Slider Controls */}
        <div className="absolute right-5 bottom-6 z-40 flex items-center gap-3 sm:right-10 sm:bottom-8">

          <span className="mr-1 font-serif text-sm text-white/80">
            0{activeSlide + 1}
            <span className="mx-1 text-white/40">/</span>
            04
          </span>

          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show slide ${index + 1}`}
              aria-pressed={activeSlide === index}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                activeSlide === index
                  ? "w-9 bg-[#D99A72]"
                  : "w-4 bg-white/50 hover:bg-white"
              }`}
            />
          ))}

        </div>

      </div>

    </section>
  );
}