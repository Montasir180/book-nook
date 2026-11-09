import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

import { auth } from "@/lib/auth";
import {
  borrowMongoClient,
  getBorrowDatabase,
} from "@/lib/borrow-db";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first." },
        { status: 401 }
      );
    }

    const { borrowId } = await request.json();

    if (!ObjectId.isValid(borrowId)) {
      return NextResponse.json(
        { success: false, message: "Invalid borrow ID." },
        { status: 400 }
      );
    }

    const db = await getBorrowDatabase();

    const borrows = db.collection("borrows");
    const books = db.collection("books");

    const mongoSession = borrowMongoClient.startSession();

    try {
      await mongoSession.withTransaction(async () => {
        const borrow = await borrows.findOne(
          {
            _id: new ObjectId(borrowId),
            userId: session.user.id,
            status: "borrowed",
          },
          { session: mongoSession }
        );

        if (!borrow) {
          throw new Error("BORROW_NOT_FOUND");
        }

        const result = await borrows.updateOne(
          {
            _id: borrow._id,
            status: "borrowed",
          },
          {
            $set: {
              status: "returned",
              returnedAt: new Date(),
            },
          },
          { session: mongoSession }
        );

        if (result.modifiedCount !== 1) {
          throw new Error("ALREADY_RETURNED");
        }

        await books.updateOne(
          {
            _id: new ObjectId(borrow.bookId),
          },
          {
            $inc: { totalCopies: 1 },
          },
          { session: mongoSession }
        );
      });
    } finally {
      await mongoSession.endSession();
    }

    return NextResponse.json({
      success: true,
      message: "Book returned successfully!",
    });
  } catch (error) {
    console.error("Return API Error:", error);

    if (
      error.message === "BORROW_NOT_FOUND" ||
      error.message === "ALREADY_RETURNED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Borrow record not found or already returned.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to return book.",
      },
      { status: 500 }
    );
  }
}