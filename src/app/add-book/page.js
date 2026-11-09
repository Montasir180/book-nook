"use client";

import { useState } from "react";
import Link from "next/link";

import {
  BookOpen,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Plus,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
  User,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const initialFormData = {
  bookName: "",
  authorName: "",
  ownerName: "",
  category: "",
  publishedYear: "",
  totalCopies: 1,
  imageUrl: "",
  description: "",
};

const inputStyle =
  "w-full rounded-xl border border-[#E4DED2] bg-[#F9F8F5] px-4 py-3 text-sm text-[#252722] outline-none transition-all duration-300 placeholder:text-[#AAA69B] hover:border-[#C9BFB0] focus:border-[#B84E2D] focus:bg-white focus:ring-4 focus:ring-[#B84E2D]/5";

const labelStyle =
  "mb-2 block text-sm font-semibold text-[#37382F]";

export default function AddBookPage() {
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const [formData, setFormData] = useState(initialFormData);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "imageUrl") {
      setImageError(false);
    }

    setMessage({
      text: "",
      type: "",
    });
  };

  // SUBMIT BOOK
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setMessage({
      text: "",
      type: "",
    });

    try {
      const response = await fetch(`${API_URL}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          publishedYear: formData.publishedYear
            ? Number(formData.publishedYear)
            : null,
          totalCopies: Number(formData.totalCopies),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      setMessage({
        text: "Book added successfully to your library!",
        type: "success",
      });

      setFormData(initialFormData);
      setImageError(false);
    } catch (error) {
      console.error("Add Book Error:", error);

      setMessage({
        text: error.message || "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // RESET FORM
  const handleReset = () => {
    setFormData(initialFormData);
    setImageError(false);

    setMessage({
      text: "",
      type: "",
    });
  };

  return (
    <section className="min-h-screen bg-[#F7F4EC] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/books"
            className="mb-5 inline-flex items-center gap-2 text-sm text-[#77776D] transition-colors hover:text-[#B84E2D]"
          >
            <ArrowLeft size={16} />
            Back to Books
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#B84E2D]">
                <BookOpen size={18} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Book Management
                </span>
              </div>

              <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#252722] sm:text-4xl">
                Add a New Book
                <span className="text-[#B84E2D]">.</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#77776D]">
                Expand your library by adding a new book to your
                collection. Fill in the details below.
              </p>
            </div>

            <div className="flex size-14 items-center justify-center rounded-2xl border border-[#E4DED2] bg-white text-[#B84E2D] shadow-sm">
              <Plus size={27} />
            </div>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="overflow-hidden rounded-2xl border border-[#E4DED2] bg-white shadow-[0_8px_35px_rgba(37,39,34,0.04)]">

          {/* FORM HEADER */}
          <div className="border-b border-[#EAE5DB] px-6 py-5 sm:px-9">
            <h2 className="font-serif text-xl font-semibold text-[#252722]">
              Book Information
            </h2>

            <p className="mt-1 text-xs text-[#999589]">
              Fields marked with * are required.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-7 p-6 sm:p-9 lg:grid-cols-3">

              {/* LEFT SIDE */}
              <div className="space-y-6 lg:col-span-2">

                {/* BOOK NAME */}
                <div>
                  <label className={labelStyle}>
                    Book Name *
                  </label>

                  <input
                    type="text"
                    name="bookName"
                    value={formData.bookName}
                    onChange={handleChange}
                    placeholder="e.g. The Alchemist"
                    className={inputStyle}
                    required
                  />
                </div>

                {/* AUTHOR NAME */}
                <div>
                  <label className={labelStyle}>
                    Author Name *
                  </label>

                  <input
                    type="text"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="e.g. Paulo Coelho"
                    className={inputStyle}
                    required
                  />
                </div>

                {/* OWNER NAME - NEW FIELD */}
                <div>
                  <label className={labelStyle}>
                    <span className="inline-flex items-center gap-2">
                      <User size={15} />
                      Owner Name *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={inputStyle}
                    required
                  />

                  <p className="mt-2 text-xs text-[#999589]">
                    Enter the name of the person adding this book to the library.
                  </p>
                </div>

                {/* CATEGORY */}
                <div>
                  <label className={labelStyle}>
                    Category *
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={inputStyle}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="Technology">Technology</option>
                    <option value="History">History</option>
                    <option value="Biography">Biography</option>
                    <option value="Romance">Romance</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Islamic">Islamic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* YEAR & COPIES */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelStyle}>
                      Published Year
                    </label>

                    <input
                      type="number"
                      name="publishedYear"
                      value={formData.publishedYear}
                      onChange={handleChange}
                      placeholder="e.g. 2024"
                      min="1000"
                      max="2100"
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Total Copies *
                    </label>

                    <input
                      type="number"
                      name="totalCopies"
                      value={formData.totalCopies}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      className={inputStyle}
                      required
                    />
                  </div>
                </div>

                {/* IMAGE URL */}
                <div>
                  <label className={labelStyle}>
                    Book Cover Image URL *
                  </label>

                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/book-cover.jpg"
                    className={inputStyle}
                    required
                  />
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className={labelStyle}>
                    Book Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Write a short description about this book..."
                    rows={6}
                    className={`${inputStyle} resize-none`}
                    required
                  />
                </div>
              </div>

              {/* RIGHT SIDE - PREVIEW */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 rounded-2xl border border-[#E4DED2] bg-[#F9F8F5] p-5">

                  <div className="mb-5">
                    <h3 className="font-serif text-lg font-semibold text-[#252722]">
                      Book Cover
                    </h3>

                    <p className="mt-1 text-xs text-[#999589]">
                      Live image preview
                    </p>
                  </div>

                  {/* IMAGE PREVIEW */}
                  <div className="flex min-h-[260px] items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#D8D0C3] bg-white p-4">
                    {formData.imageUrl && !imageError ? (
                      <img
                        src={formData.imageUrl}
                        alt="Book cover preview"
                        className="max-h-[260px] w-auto max-w-full rounded-lg object-contain"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#F7F4EC] text-[#B84E2D]">
                          <ImageIcon size={28} strokeWidth={1.4} />
                        </div>

                        <p className="text-sm font-medium text-[#55584F]">
                          {imageError
                            ? "Invalid image URL"
                            : "No image selected"}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-[#999589]">
                          Paste an image URL to see your book cover here.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* PREVIEW DETAILS */}
                  <div className="mt-5 border-t border-[#E4DED2] pt-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B84E2D]">
                      Preview Details
                    </span>

                    <h4 className="mt-3 font-serif text-lg font-semibold text-[#252722]">
                      {formData.bookName || "Your Book Title"}
                    </h4>

                    <p className="mt-1 text-sm text-[#77776D]">
                      {formData.authorName || "Author Name"}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-[#77776D]">
                      <User size={15} className="text-[#B84E2D]" />
                      {formData.ownerName || "Owner Name"}
                    </div>

                    {formData.category && (
                      <span className="mt-4 inline-block rounded-full bg-[#B84E2D]/10 px-3 py-1 text-xs font-medium text-[#B84E2D]">
                        {formData.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SUCCESS / ERROR MESSAGE */}
            {message.text && (
              <div
                className={`mx-6 mb-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm sm:mx-9 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}

                {message.text}
              </div>
            )}

            {/* FORM FOOTER */}
            <div className="flex flex-col-reverse justify-between gap-4 border-t border-[#EAE5DB] bg-[#FCFBF8] px-6 py-6 sm:flex-row sm:items-center sm:px-9">

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4DED2] px-6 py-3 text-sm font-medium text-[#77776D] transition-all hover:border-[#B84E2D] hover:text-[#B84E2D] disabled:opacity-50"
              >
                <X size={16} />
                Clear Form
              </button>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#252722] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#B84E2D] hover:shadow-lg hover:shadow-[#B84E2D]/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Adding Book...
                  </>
                ) : (
                  <>
                    <Upload size={17} />
                    Add Book to Library
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-[#999589]">
          Every book has a story. Make yours part of BookNook.
        </p>
      </div>
    </section>
  );
}