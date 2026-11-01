"use client";

import { ArrowRight } from "lucide-react";

export default function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-md items-center rounded-full border border-white/20 bg-white/5 p-1.5 transition-colors focus-within:border-[#D98B6C] md:w-auto"
    >
      <input
        type="email"
        placeholder="Your email address"
        aria-label="Email address"
        required
        className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/40"
      />

      <button
        type="submit"
        className="flex shrink-0 items-center gap-2 rounded-full bg-[#B84E2D] px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-[#D15B38]"
      >
        Subscribe
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
