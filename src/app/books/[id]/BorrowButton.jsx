"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  BookOpen,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function BorrowButton({
  bookId,
  totalCopies,
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleBorrow() {
    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Borrow failed.");
      }

      setSuccess(true);
      setMessage(data.message || "Book borrowed successfully!");

      router.refresh();

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-7">

      <button
        onClick={handleBorrow}
        disabled={loading || totalCopies < 1}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#B84E2D] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#963C22] disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
      >

        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <BookOpen size={18} />
        )}

        {loading
          ? "Processing..."
          : totalCopies > 0
            ? "Borrow This Book"
            : "Currently Unavailable"}

      </button>

      {message && (
        <p
          className={`mt-3 flex items-center gap-2 text-sm font-medium ${
            success ? "text-green-700" : "text-red-600"
          }`}
        >
          {success && <CheckCircle2 size={17} />}
          {message}
        </p>
      )}

    </div>
  );
}