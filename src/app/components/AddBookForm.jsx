"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  AlignLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  FlaskConical,
  ImageOff,
  Landmark,
  Layers3,
  Library,
  Link2,
  LoaderCircle,
  LogIn,
  Minus,
  Plus,
  RotateCcw,
  Shapes,
  ShieldCheck,
  Smile,
  Sparkles,
  Tags,
  UserRound,
  X,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

import "./add-book.css";

const EMPTY_BOOK = {
  title: "",
  author: "",
  description: "",
  imageUrl: "",
  availableCopies: "1",
  category: "",
};

const FIELD_NAMES = [
  "title",
  "author",
  "description",
  "imageUrl",
  "availableCopies",
  "category",
];

const CATEGORY_META = {
  Fiction: { icon: BookOpen, blurb: "Novels and imagined worlds" },
  Science: { icon: FlaskConical, blurb: "Discovery and big ideas" },
  History: { icon: Landmark, blurb: "The stories that shaped us" },
  Kids: { icon: Smile, blurb: "For younger readers" },
  Others: { icon: Shapes, blurb: "Essays, poetry, and more" },
};

const CATEGORY_NAMES = Object.keys(CATEGORY_META);

function validateField(field, values) {
  const rawValue = values[field] ?? "";
  const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;

  switch (field) {
    case "title":
      if (!value) return "Please enter the book's name.";
      if (value.length < 2) return "The title needs at least 2 characters.";
      if (value.length > 120) return "Keep the title under 120 characters.";
      return "";

    case "author":
      if (!value) return "Please enter the author's name.";
      if (value.length < 2) return "The author's name needs at least 2 characters.";
      if (value.length > 100) return "Keep the author's name under 100 characters.";
      return "";

    case "description":
      if (!value) return "Add a short description for readers.";
      if (value.length < 20) {
        return "Tell readers a little more (at least 20 characters).";
      }
      if (value.length > 1000) return "Keep the description under 1,000 characters.";
      return "";

    case "imageUrl": {
      if (!value) return "Paste a cover image URL.";
      if (value.length > 2048) return "That image link is too long.";

      try {
        const url = new URL(value);
        if (url.protocol !== "http:" && url.protocol !== "https:") {
          return "Use a link that starts with http:// or https://.";
        }
      } catch {
        return "Enter a complete image URL, like https://example.com/cover.jpg.";
      }

      return "";
    }

    case "availableCopies": {
      if (String(value) === "") return "Enter the number of available copies.";
      const copies = Number(value);
      if (!Number.isFinite(copies) || !Number.isInteger(copies)) {
        return "Enter a whole number of copies.";
      }
      if (copies < 1) return "There must be at least 1 copy available.";
      if (copies > 999) return "Keep the number of copies at 999 or fewer.";
      return "";
    }

    case "category":
      if (!value) return "Choose a category for this book.";
      if (!CATEGORY_NAMES.includes(value)) return "Choose a valid category.";
      return "";

    default:
      return "";
  }
}

function validateBook(values) {
  const nextErrors = {};

  FIELD_NAMES.forEach((field) => {
    const message = validateField(field, values);
    if (message) nextErrors[field] = message;
  });

  return nextErrors;
}

function isValidImageUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getImageHost(value) {
  try {
    return new URL(value.trim()).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function getInitials(name) {
  return (
    name
      ?.trim()
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "BN"
  );
}

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="addbook-toast-stack" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            className={`addbook-toast ${
              isError ? "addbook-toast-error" : "addbook-toast-success"
            } ${toast.leaving ? "is-leaving" : ""}`}
            role={isError ? "alert" : "status"}
          >
            <span className="addbook-toast-icon" aria-hidden="true">
              {isError ? <CircleAlert size={17} /> : <CircleCheck size={17} />}
            </span>

            <div className="addbook-toast-body">
              <p className="addbook-toast-title">{toast.title}</p>
              <p className="addbook-toast-message">{toast.message}</p>

              {toast.action ? (
                <Link className="addbook-toast-action" href={toast.action.href}>
                  {toast.action.label}
                  <ArrowRight size={11} />
                </Link>
              ) : null}
            </div>

            <button
              type="button"
              className="addbook-toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={13} />
            </button>

            <span className="addbook-toast-progress" aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

export default function AddBookForm() {
  const { data: session, isPending } = useSession();

  const [values, setValues] = useState(EMPTY_BOOK);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageState, setImageState] = useState({ url: "", status: "idle" });
  const [toasts, setToasts] = useState([]);

  const toastIdRef = useRef(0);
  const toastTimersRef = useRef(new Map());

  const titleRef = useRef(null);
  const authorRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageUrlRef = useRef(null);
  const copiesRef = useRef(null);
  const categoryRef = useRef(null);

  const user = session?.user;
  const userInitials = getInitials(user?.name);

  const trimmedImageUrl = values.imageUrl.trim();
  const imageUrlIsValid = isValidImageUrl(trimmedImageUrl);
  const imageHost = imageUrlIsValid ? getImageHost(trimmedImageUrl) : "";

  const imageStatus = !trimmedImageUrl
    ? "idle"
    : !imageUrlIsValid
      ? "invalid"
      : imageState.url === trimmedImageUrl
        ? imageState.status
        : "loading";

  const imageCopy =
    imageStatus === "loading"
      ? {
          label: "Fetching cover...",
          hint: imageHost
            ? `Loading from ${imageHost}`
            : "Loading your cover image.",
        }
      : imageStatus === "loaded"
        ? {
            label: "Cover ready",
            hint: imageHost
              ? `Image from ${imageHost}`
              : "Your cover is ready for the shelf.",
          }
        : imageStatus === "error"
          ? {
              label: "Cover unavailable",
              hint: "That link did not load. Try another image URL.",
            }
          : imageStatus === "invalid"
            ? {
                label: "Check the URL",
                hint: "Use a complete link starting with http:// or https://.",
              }
            : {
                label: "Cover preview",
                hint: "Paste a portrait image link to see it here.",
              };

  const copies = Number(values.availableCopies);
  const copiesAreValid = Number.isInteger(copies) && copies >= 1 && copies <= 999;
  const copiesLabel = copiesAreValid
    ? `${copies} ${copies === 1 ? "copy" : "copies"}`
    : "Copies";

  const completionChecks = [
    values.title.trim().length >= 2,
    values.author.trim().length >= 2,
    values.description.trim().length >= 20,
    imageUrlIsValid,
    copiesAreValid,
    CATEGORY_NAMES.includes(values.category),
  ];
  const completion = Math.round(
    (completionChecks.filter(Boolean).length / completionChecks.length) * 100,
  );

  const previewTitle = values.title.trim() || "Your book title";
  const previewAuthor = values.author.trim() || "Author name";
  const previewDescription =
    values.description.trim() ||
    "A short description will appear here, giving readers a glimpse of the story inside.";

  const categoryMeta = CATEGORY_META[values.category] || null;
  const PreviewCategoryIcon = categoryMeta?.icon || Tags;

  const isDirty = Object.keys(EMPTY_BOOK).some(
    (key) => values[key] !== EMPTY_BOOK[key],
  );

  useEffect(() => {
    const timers = toastTimersRef.current;

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((current) =>
      current.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast,
      ),
    );

    const timer = window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
      toastTimersRef.current.delete(`remove-${id}`);
    }, 240);

    toastTimersRef.current.set(`remove-${id}`, timer);
  }, []);

  const dismissToast = useCallback(
    (id) => {
      const autoTimer = toastTimersRef.current.get(`auto-${id}`);

      if (autoTimer) {
        window.clearTimeout(autoTimer);
        toastTimersRef.current.delete(`auto-${id}`);
      }

      removeToast(id);
    },
    [removeToast],
  );

  const pushToast = useCallback(
    (toast) => {
      const id = ++toastIdRef.current;

      setToasts((current) => [
        ...current.slice(-2),
        { ...toast, id, leaving: false },
      ]);

      const timer = window.setTimeout(() => {
        removeToast(id);
        toastTimersRef.current.delete(`auto-${id}`);
      }, 5200);

      toastTimersRef.current.set(`auto-${id}`, timer);
    },
    [removeToast],
  );

  const updateField = (field, value) => {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);

    if (touched[field]) {
      const message = validateField(field, nextValues);

      setErrors((current) => {
        const next = { ...current };

        if (message) next[field] = message;
        else delete next[field];

        return next;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((current) =>
      current[field] ? current : { ...current, [field]: true },
    );

    setErrors((current) => {
      const message = validateField(field, values);
      const next = { ...current };

      if (message) next[field] = message;
      else delete next[field];

      return next;
    });
  };

  const stepCopies = (delta) => {
    const currentValue = Number(values.availableCopies);
    const base =
      Number.isFinite(currentValue) && currentValue > 0
        ? Math.trunc(currentValue)
        : 1;
    const next = Math.min(999, Math.max(1, base + delta));

    updateField("availableCopies", String(next));
    setTouched((current) => ({ ...current, availableCopies: true }));
  };

  const handleImageLoad = () => {
    setImageState({ url: trimmedImageUrl, status: "loaded" });
  };

  const handleImageError = () => {
    setImageState({ url: trimmedImageUrl, status: "error" });
  };

  const handleReset = () => {
    if (loading) return;

    setValues(EMPTY_BOOK);
    setErrors({});
    setTouched({});
    setImageState({ url: "", status: "idle" });
    titleRef.current?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    const nextErrors = validateBook(values);
    const errorFields = Object.keys(nextErrors);

    if (errorFields.length) {
      setErrors(nextErrors);
      setTouched(
        Object.fromEntries(FIELD_NAMES.map((field) => [field, true])),
      );

      pushToast({
        type: "error",
        title: "A few details need attention",
        message: "Please fix the highlighted fields and try again.",
      });

      const fieldRefs = {
        title: titleRef,
        author: authorRef,
        description: descriptionRef,
        imageUrl: imageUrlRef,
        availableCopies: copiesRef,
        category: categoryRef,
      };
      const firstInvalid = FIELD_NAMES.find((field) => nextErrors[field]);

      if (firstInvalid) {
        window.requestAnimationFrame(() => {
          fieldRefs[firstInvalid]?.current?.focus();
        });
      }

      return;
    }

    if (!isPending && !user) {
      pushToast({
        type: "error",
        title: "Sign in to add this book",
        message:
          "Your shelf is waiting. Sign in to save this book to BookNook.",
        action: { label: "Go to sign in", href: "/login" },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          title: values.title.trim(),
          author: values.author.trim(),
          description: values.description.trim(),
          imageUrl: values.imageUrl.trim(),
          availableCopies: Number(values.availableCopies),
          category: values.category,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(
          payload?.error || "Something went wrong. Please try again.",
        );
        error.status = response.status;
        throw error;
      }

      pushToast({
        type: "success",
        title: "Book added to the shelf",
        message: `"${values.title.trim()}" is ready for its next reader.`,
      });

      setValues(EMPTY_BOOK);
      setErrors({});
      setTouched({});
      setImageState({ url: "", status: "idle" });
    } catch (error) {
      if (error.status === 401) {
        pushToast({
          type: "error",
          title: "Your session has ended",
          message: "Sign in again to add this book to the shelf.",
          action: { label: "Sign in", href: "/login" },
        });
      } else {
        pushToast({
          type: "error",
          title: "Couldn't add this book",
          message:
            error instanceof TypeError
              ? "We couldn't reach the server. Check your connection and try again."
              : error.message || "Please try again in a moment.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="addbook-page" data-theme="booknook">
      <div className="addbook-atmosphere" aria-hidden="true">
        <span className="addbook-orb addbook-orb-gold" />
        <span className="addbook-orb addbook-orb-green" />
        <span className="addbook-orb addbook-orb-cream" />
        <BookOpen
          className="addbook-floating-book addbook-floating-book-one"
          strokeWidth={0.7}
        />
        <BookOpen
          className="addbook-floating-book addbook-floating-book-two"
          strokeWidth={0.7}
        />
      </div>

      <div className="addbook-shell">
        <header className="addbook-hero">
          <div className="addbook-hero-copy">
            <span className="addbook-eyebrow">
              <Sparkles size={12} />
              CURATE THE COLLECTION
            </span>

            <h1 className="addbook-title">
              Give a story <em>a new home.</em>
            </h1>

            <p className="addbook-subtitle">
              Add a book to the BookNook shelf with a cover, a few details, and
              the copies you are ready to share.
            </p>
          </div>

          <div className="addbook-hero-aside">
            <div className="addbook-hero-card">
              <span className="addbook-hero-card-icon">
                <Library size={18} />
              </span>

              <div>
                <strong>Every shelf tells a story.</strong>
                <p>Fill in the details and watch your book come to life.</p>
              </div>
            </div>

            <div className="addbook-hero-meta">
              <span>
                <BookMarked size={12} />
                Community library
              </span>
              <span className="addbook-hero-meta-dot" />
              <span>Free to share</span>
            </div>
          </div>
        </header>

        <div className="addbook-layout">
          <section
            className="addbook-panel"
            aria-labelledby="addbook-form-title"
          >
            <form
              className="addbook-form"
              onSubmit={handleSubmit}
              noValidate
              aria-busy={loading}
            >
              <div className="addbook-panel-head">
                <div>
                  <span className="addbook-kicker">
                    <span className="addbook-kicker-dot" />
                    NEW ARRIVAL
                  </span>

                  <h2 id="addbook-form-title" className="addbook-panel-title">
                    Book details
                  </h2>
                  <p className="addbook-panel-subtitle">
                    A little care here makes a big difference on the shelf.
                  </p>
                </div>

                <span className="addbook-required-pill">
                  <span>*</span> All fields required
                </span>
              </div>

              <div className="addbook-section">
                <div className="addbook-section-head">
                  <span className="addbook-step">01</span>
                  <div>
                    <h3 className="addbook-section-title">The essentials</h3>
                    <p className="addbook-section-subtitle">
                      Name the book, credit the author, and place it on the
                      right shelf.
                    </p>
                  </div>
                </div>

                <div className="addbook-field">
                  <div className="addbook-label-row">
                    <label className="addbook-label" htmlFor="book-title">
                      <BookOpen size={14} />
                      Book name
                      <span className="addbook-required">*</span>
                    </label>
                    <span className="addbook-label-hint">
                      The title readers will see
                    </span>
                  </div>

                  <div className="addbook-control-wrap">
                    <BookOpen
                      size={17}
                      className="addbook-control-icon"
                      aria-hidden="true"
                    />
                    <input
                      ref={titleRef}
                      id="book-title"
                      name="title"
                      type="text"
                      className="input addbook-control"
                      placeholder="e.g. The Midnight Library"
                      value={values.title}
                      onChange={(event) =>
                        updateField("title", event.target.value)
                      }
                      onBlur={() => handleBlur("title")}
                      aria-invalid={Boolean(errors.title)}
                      aria-describedby={
                        errors.title ? "book-title-error" : undefined
                      }
                      maxLength={120}
                      autoComplete="off"
                      required
                    />
                  </div>

                  {errors.title ? (
                    <p
                      id="book-title-error"
                      className="addbook-error"
                      role="alert"
                    >
                      <CircleAlert size={13} />
                      {errors.title}
                    </p>
                  ) : null}
                </div>

                <div className="addbook-field">
                  <div className="addbook-label-row">
                    <label className="addbook-label" htmlFor="book-author">
                      <UserRound size={14} />
                      Author name
                      <span className="addbook-required">*</span>
                    </label>
                    <span className="addbook-label-hint">
                      Credit the storyteller
                    </span>
                  </div>

                  <div className="addbook-control-wrap">
                    <UserRound
                      size={17}
                      className="addbook-control-icon"
                      aria-hidden="true"
                    />
                    <input
                      ref={authorRef}
                      id="book-author"
                      name="author"
                      type="text"
                      className="input addbook-control"
                      placeholder="e.g. Matt Haig"
                      value={values.author}
                      onChange={(event) =>
                        updateField("author", event.target.value)
                      }
                      onBlur={() => handleBlur("author")}
                      aria-invalid={Boolean(errors.author)}
                      aria-describedby={
                        errors.author ? "book-author-error" : undefined
                      }
                      maxLength={100}
                      autoComplete="off"
                      required
                    />
                  </div>

                  {errors.author ? (
                    <p
                      id="book-author-error"
                      className="addbook-error"
                      role="alert"
                    >
                      <CircleAlert size={13} />
                      {errors.author}
                    </p>
                  ) : null}
                </div>

                <div className="addbook-field-grid">
                  <div className="addbook-field">
                    <div className="addbook-label-row">
                      <label
                        className="addbook-label"
                        htmlFor="book-category"
                      >
                        <Tags size={14} />
                        Category
                        <span className="addbook-required">*</span>
                      </label>
                    </div>

                    <div className="addbook-control-wrap">
                      <Tags
                        size={17}
                        className="addbook-control-icon"
                        aria-hidden="true"
                      />
                      <select
                        ref={categoryRef}
                        id="book-category"
                        name="category"
                        className={`select addbook-control addbook-select ${
                          values.category ? "" : "is-placeholder"
                        }`}
                        value={values.category}
                        onChange={(event) =>
                          updateField("category", event.target.value)
                        }
                        onBlur={() => handleBlur("category")}
                        aria-invalid={Boolean(errors.category)}
                        aria-describedby={
                          errors.category ? "book-category-error" : undefined
                        }
                        required
                      >
                        <option value="" disabled>
                          Choose a category
                        </option>
                        {CATEGORY_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="addbook-select-chevron"
                        aria-hidden="true"
                      />
                    </div>

                    {errors.category ? (
                      <p
                        id="book-category-error"
                        className="addbook-error"
                        role="alert"
                      >
                        <CircleAlert size={13} />
                        {errors.category}
                      </p>
                    ) : categoryMeta ? (
                      <p className="addbook-hint">{categoryMeta.blurb}</p>
                    ) : null}
                  </div>

                  <div className="addbook-field">
                    <div className="addbook-label-row">
                      <label className="addbook-label" htmlFor="book-copies">
                        <Layers3 size={14} />
                        Available books
                        <span className="addbook-required">*</span>
                      </label>
                    </div>

                    <div className="addbook-control-wrap">
                      <Layers3
                        size={17}
                        className="addbook-control-icon"
                        aria-hidden="true"
                      />
                      <input
                        ref={copiesRef}
                        id="book-copies"
                        name="availableCopies"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        max="999"
                        step="1"
                        className="input addbook-control addbook-number"
                        value={values.availableCopies}
                        onChange={(event) =>
                          updateField("availableCopies", event.target.value)
                        }
                        onBlur={() => handleBlur("availableCopies")}
                        aria-invalid={Boolean(errors.availableCopies)}
                        aria-describedby={
                          errors.availableCopies
                            ? "book-copies-error"
                            : "book-copies-hint"
                        }
                        required
                      />

                      <div className="addbook-stepper">
                        <button
                          type="button"
                          className="addbook-step-btn"
                          onClick={() => stepCopies(-1)}
                          disabled={Number(values.availableCopies) <= 1}
                          aria-label="Decrease available copies"
                        >
                          <Minus size={13} />
                        </button>
                        <button
                          type="button"
                          className="addbook-step-btn"
                          onClick={() => stepCopies(1)}
                          disabled={Number(values.availableCopies) >= 999}
                          aria-label="Increase available copies"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {errors.availableCopies ? (
                      <p
                        id="book-copies-error"
                        className="addbook-error"
                        role="alert"
                      >
                        <CircleAlert size={13} />
                        {errors.availableCopies}
                      </p>
                    ) : (
                      <p id="book-copies-hint" className="addbook-hint">
                        How many copies can readers borrow?
                      </p>
                    )}
                  </div>
                </div>

                <div className="addbook-field">
                  <div className="addbook-label-row">
                    <label
                      className="addbook-label"
                      htmlFor="book-description"
                    >
                      <AlignLeft size={14} />
                      Book description
                      <span className="addbook-required">*</span>
                    </label>
                    <span className="addbook-label-hint">Set the scene</span>
                  </div>

                  <div className="addbook-control-wrap">
                    <textarea
                      ref={descriptionRef}
                      id="book-description"
                      name="description"
                      rows={5}
                      className="textarea addbook-control addbook-textarea"
                      placeholder="What is this book about? A sentence or two is enough to make a reader curious."
                      value={values.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      onBlur={() => handleBlur("description")}
                      aria-invalid={Boolean(errors.description)}
                      aria-describedby={
                        errors.description
                          ? "book-description-error"
                          : "book-description-hint"
                      }
                      maxLength={1000}
                      required
                    />
                  </div>

                  <div className="addbook-field-meta">
                    {errors.description ? (
                      <p
                        id="book-description-error"
                        className="addbook-error"
                        role="alert"
                      >
                        <CircleAlert size={13} />
                        {errors.description}
                      </p>
                    ) : (
                      <p id="book-description-hint" className="addbook-hint">
                        A sentence or two is plenty.
                      </p>
                    )}

                    <span
                      className={`addbook-counter ${
                        values.description.length > 900
                          ? "is-near-limit"
                          : ""
                      }`}
                    >
                      {values.description.length}/1000
                    </span>
                  </div>
                </div>
              </div>

              <div className="addbook-section">
                <div className="addbook-section-head">
                  <span className="addbook-step">02</span>
                  <div>
                    <h3 className="addbook-section-title">The cover</h3>
                    <p className="addbook-section-subtitle">
                      Give readers a first impression they cannot walk past.
                    </p>
                  </div>
                </div>

                <div className="addbook-field">
                  <div className="addbook-label-row">
                    <label className="addbook-label" htmlFor="book-image">
                      <Link2 size={14} />
                      Book image URL
                      <span className="addbook-required">*</span>
                    </label>
                    <span className="addbook-label-hint">
                      Portrait images look best
                    </span>
                  </div>

                  <div className="addbook-control-wrap">
                    <Link2
                      size={17}
                      className="addbook-control-icon"
                      aria-hidden="true"
                    />
                    <input
                      ref={imageUrlRef}
                      id="book-image"
                      name="imageUrl"
                      type="url"
                      className="input addbook-control"
                      placeholder="https://images.example.com/cover.jpg"
                      value={values.imageUrl}
                      onChange={(event) =>
                        updateField("imageUrl", event.target.value)
                      }
                      onBlur={() => handleBlur("imageUrl")}
                      aria-invalid={Boolean(errors.imageUrl)}
                      aria-describedby={
                        errors.imageUrl ? "book-image-error" : "book-image-hint"
                      }
                      maxLength={2048}
                      autoComplete="off"
                      spellCheck={false}
                      inputMode="url"
                      required
                    />
                  </div>

                  {errors.imageUrl ? (
                    <p
                      id="book-image-error"
                      className="addbook-error"
                      role="alert"
                    >
                      <CircleAlert size={13} />
                      {errors.imageUrl}
                    </p>
                  ) : (
                    <p id="book-image-hint" className="addbook-hint">
                      Paste a direct link to the cover image.
                    </p>
                  )}

                  <div className="addbook-cover-strip">
                    <div className="addbook-cover-thumb">
                      {imageUrlIsValid ? (
                        <img
                          key={trimmedImageUrl}
                          src={trimmedImageUrl}
                          alt={
                            values.title.trim()
                              ? `Cover preview of ${values.title.trim()}`
                              : "Book cover preview"
                          }
                          className={
                            imageStatus === "loaded" ? "is-visible" : ""
                          }
                          onLoad={handleImageLoad}
                          onError={handleImageError}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}

                      {imageStatus === "loading" ? (
                        <span
                          className="addbook-cover-skeleton"
                          aria-hidden="true"
                        />
                      ) : null}

                      {imageStatus !== "loaded" ? (
                        <span
                          className="addbook-cover-placeholder"
                          aria-hidden="true"
                        >
                          {imageStatus === "error" ||
                          imageStatus === "invalid" ? (
                            <ImageOff size={17} />
                          ) : (
                            <BookOpen size={17} />
                          )}
                        </span>
                      ) : null}
                    </div>

                    <div className="addbook-cover-copy">
                      <span
                        className={`addbook-cover-status ${
                          imageStatus === "loaded"
                            ? "is-ready"
                            : imageStatus === "error" ||
                                imageStatus === "invalid"
                              ? "is-error"
                              : ""
                        }`}
                      >
                        {imageStatus === "loading" ? (
                          <LoaderCircle
                            size={12}
                            className="addbook-spinner"
                          />
                        ) : imageStatus === "loaded" ? (
                          <Check size={12} />
                        ) : imageStatus === "idle" ? (
                          <BookOpen size={12} />
                        ) : (
                          <CircleAlert size={12} />
                        )}
                        {imageCopy.label}
                      </span>
                      <p>{imageCopy.hint}</p>
                    </div>

                    {values.imageUrl ? (
                      <button
                        type="button"
                        className="addbook-cover-clear"
                        onClick={() => updateField("imageUrl", "")}
                        aria-label="Clear image URL"
                      >
                        <X size={13} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="addbook-form-footer">
                <div className="addbook-save-row">
                  {isPending ? (
                    <span className="addbook-guest-chip">
                      <LoaderCircle size={12} className="addbook-spinner" />
                      Checking your shelf...
                    </span>
                  ) : user ? (
                    <span className="addbook-user-chip">
                      <span className="addbook-user-avatar">
                        {userInitials}
                      </span>
                      <span className="addbook-user-copy">
                        Adding as <strong>{user.name || "Reader"}</strong>
                      </span>
                    </span>
                  ) : (
                    <span className="addbook-guest-chip">
                      <LogIn size={12} />
                      Guest preview
                      <span className="addbook-chip-divider" />
                      <Link href="/login">sign in to save</Link>
                    </span>
                  )}
                </div>

                <div className="addbook-actions">
                  <button
                    type="button"
                    className="addbook-clear"
                    onClick={handleReset}
                    disabled={loading || !isDirty}
                    aria-label="Clear form"
                  >
                    <RotateCcw size={14} />
                    <span>Clear</span>
                  </button>

                  <button
                    type="submit"
                    className="btn addbook-submit"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="addbook-spinner"
                        />
                        <span>Adding to the shelf...</span>
                      </>
                    ) : (
                      <>
                        <span>Add Book</span>
                        <span className="addbook-submit-icon">
                          <ArrowRight size={15} />
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="addbook-disclaimer">
                <ShieldCheck size={13} />
                By adding this book, you confirm you have the right to share it
                with the BookNook community.
              </p>
            </form>
          </section>

          <aside className="addbook-preview-rail" aria-label="Live book preview">
            <div className="addbook-preview-heading">
              <div>
                <span className="addbook-kicker">
                  <span className="addbook-kicker-dot addbook-live-dot" />
                  LIVE PREVIEW
                </span>
                <h2 className="addbook-preview-title">On the shelf</h2>
              </div>

              <span className="addbook-preview-badge">As readers see it</span>
            </div>

            <div className="addbook-readiness">
              <div className="addbook-readiness-row">
                <span>Shelf readiness</span>
                <strong>{completion}%</strong>
              </div>

              <div
                className="addbook-readiness-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completion}
                aria-label="Shelf readiness"
              >
                <span
                  className="addbook-readiness-fill"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <article className="addbook-preview-card">
              <div className="addbook-preview-glow" aria-hidden="true" />

              <div className="addbook-preview-cover-wrap">
                <div
                  className={`addbook-preview-cover ${
                    imageStatus === "loaded" ? "has-image" : ""
                  }`}
                >
                  {imageUrlIsValid ? (
                    <img
                      key={trimmedImageUrl}
                      src={trimmedImageUrl}
                      alt={
                        values.title.trim()
                          ? `Cover preview of ${values.title.trim()}`
                          : "Book cover preview"
                      }
                      className={imageStatus === "loaded" ? "is-visible" : ""}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  ) : null}

                  {imageStatus === "loading" ? (
                    <span
                      className="addbook-preview-loading"
                      aria-hidden="true"
                    />
                  ) : null}

                  {imageStatus !== "loaded" ? (
                    <div className="addbook-preview-placeholder">
                      {values.title.trim() ? (
                        <span className="addbook-cover-initial">
                          {values.title.trim().charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <BookOpen size={34} strokeWidth={1.4} />
                      )}
                      <small>BOOKNOOK</small>
                    </div>
                  ) : null}

                  <span className="addbook-cover-spine" aria-hidden="true" />

                  <span className="addbook-preview-category">
                    <PreviewCategoryIcon size={11} />
                    {values.category || "Category"}
                  </span>
                </div>

                <span className="addbook-preview-shadow" aria-hidden="true" />
              </div>

              <div className="addbook-preview-body">
                <h3 className="addbook-preview-book-title">{previewTitle}</h3>
                <p className="addbook-preview-author">
                  by <span>{previewAuthor}</span>
                </p>
                <p className="addbook-preview-description">
                  {previewDescription}
                </p>

                <div className="addbook-preview-meta">
                  <span className="addbook-copies">
                    <Layers3 size={13} />
                    {copiesLabel}
                  </span>

                  <span
                    className={`addbook-availability ${
                      copiesAreValid ? "is-available" : ""
                    }`}
                  >
                    <span className="addbook-availability-dot" />
                    {copiesAreValid ? "Available" : "Not ready"}
                  </span>
                </div>
              </div>
            </article>

            <div className="addbook-preview-tip">
              <span className="addbook-tip-icon">
                <Sparkles size={14} />
              </span>
              <div>
                <strong>A cover is a promise.</strong>
                <p>
                  Use a portrait image (around 2:3) so your book sits
                  beautifully on the shelf.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <footer className="addbook-page-footer">
          <span>
            <span className="addbook-footer-dot" />
            A thoughtful shelf starts with one book.
          </span>
          <span>BookNook · Your little reading space</span>
        </footer>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}
