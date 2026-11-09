import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import {
  borrowMongoClient,
  getBorrowDatabase,
} from "@/lib/borrow-db";

export async function POST(request) {
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const { bookId } = await request.json();

    if (!ObjectId.isValid(bookId)) {
      return NextResponse.json(
        { success: false, message: "Invalid book ID." },
        { status: 400 }
      );
    }

    const db = await getBorrowDatabase();
    const books = db.collection("books");
    const borrows = db.collection("borrows");

    const userId = session.user.id;

    const existing = await borrows.findOne({
      userId,
      bookId,
      status: "borrowed",
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already borrowed this book.",
        },
        { status: 409 }
      );
    }

    const borrowId = new ObjectId();

    const mongoSession = borrowMongoClient.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        const bookUpdate = await books.updateOne(
          {
            _id: new ObjectId(bookId),
            totalCopies: { $gt: 0 },
          },
          {
            $inc: { totalCopies: -1 },
          },
          { session: mongoSession }
        );

        if (bookUpdate.modifiedCount !== 1) {
          throw new Error("NO_COPIES");
        }

        await borrows.insertOne(
          {
            _id: borrowId,
            userId,
            userName: session.user.name,
            userEmail: session.user.email,
            bookId,
            status: "borrowed",
            borrowedAt: new Date(),
            returnedAt: null,
          },
          { session: mongoSession }
        );
      });
    } finally {
      await mongoSession.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Book borrowed successfully!",
    });
  } catch (error) {
    console.error("Borrow API Error:", error);

    if (error.message === "NO_COPIES") {
      return NextResponse.json(
        {
          success: false,
          message: "Sorry! No copies are currently available.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to borrow book.",
      },
      { status: 500 }
    );
  }
}