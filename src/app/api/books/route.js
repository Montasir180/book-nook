import { auth, db } from "@/lib/auth";

const CATEGORIES = new Set([
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
]);

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateBook(input) {
  const errors = {};
  const title = cleanString(input?.title);
  const author = cleanString(input?.author);
  const description = cleanString(input?.description);
  const imageUrl = cleanString(input?.imageUrl);
  const category = cleanString(input?.category);
  const availableCopies = Number(input?.availableCopies);

  if (!title) errors.title = "Please enter the book's name.";
  else if (title.length < 2) errors.title = "The title needs at least 2 characters.";
  else if (title.length > 120) errors.title = "Keep the title under 120 characters.";

  if (!author) errors.author = "Please enter the author's name.";
  else if (author.length < 2) {
    errors.author = "The author's name needs at least 2 characters.";
  } else if (author.length > 100) {
    errors.author = "Keep the author's name under 100 characters.";
  }

  if (!description) errors.description = "Add a short description for readers.";
  else if (description.length < 20) {
    errors.description = "The description needs at least 20 characters.";
  } else if (description.length > 1000) {
    errors.description = "Keep the description under 1,000 characters.";
  }

  if (!imageUrl) errors.imageUrl = "Paste a cover image URL.";
  else if (imageUrl.length > 2048) errors.imageUrl = "That image link is too long.";
  else if (!isValidHttpUrl(imageUrl)) {
    errors.imageUrl = "Use a complete http:// or https:// image URL.";
  }

  if (!Number.isInteger(availableCopies)) {
    errors.availableCopies = "Enter a whole number of copies.";
  } else if (availableCopies < 1) {
    errors.availableCopies = "There must be at least 1 copy available.";
  } else if (availableCopies > 999) {
    errors.availableCopies = "Keep the number of copies at 999 or fewer.";
  }

  if (!CATEGORIES.has(category)) {
    errors.category = "Choose a valid category.";
  }

  return {
    errors,
    book: {
      title,
      author,
      description,
      imageUrl,
      availableCopies,
      category,
    },
  };
}

export async function POST(request) {
  let session;

  try {
    session = await auth.api.getSession({ headers: request.headers });
  } catch (error) {
    console.error("Book session check failed:", error);
    return Response.json(
      { error: "Your session could not be verified. Please sign in again." },
      { status: 401 },
    );
  }

  if (!session?.user) {
    return Response.json(
      { error: "Please sign in to add a book to the shelf." },
      { status: 401 },
    );
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { error: "We could not read that request. Please try again." },
      { status: 400 },
    );
  }

  const { errors, book } = validateBook(payload);

  if (Object.keys(errors).length > 0) {
    return Response.json(
      {
        error: "Please check the highlighted details and try again.",
        fields: errors,
      },
      { status: 422 },
    );
  }

  try {
    const now = new Date();
    const result = await db.collection("books").insertOne({
      ...book,
      ownerId: session.user.id,
      ownerName: session.user.name || "",
      createdAt: now,
      updatedAt: now,
    });

    return Response.json(
      {
        book: {
          id: result.insertedId.toString(),
          title: book.title,
          category: book.category,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Could not add book:", error);
    return Response.json(
      {
        error:
          "We could not add this book right now. Please try again in a moment.",
      },
      { status: 500 },
    );
  }
}
