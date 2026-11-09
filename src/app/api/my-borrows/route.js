import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { getBorrowDatabase } from "@/lib/borrow-db";

export async function GET() {
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

    const db = await getBorrowDatabase();

    const borrows = await db
      .collection("borrows")
      .aggregate([
        {
          $match: {
            userId: session.user.id,
          },
        },
        {
          $addFields: {
            bookObjectId: {
              $toObjectId: "$bookId",
            },
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "bookObjectId",
            foreignField: "_id",
            as: "book",
          },
        },
        {
          $unwind: {
            path: "$book",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            borrowedAt: -1,
          },
        },
        {
          $project: {
            bookObjectId: 0,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      borrows,
    });
  } catch (error) {
    console.error("My Borrows Error:", error);

    return NextResponse.json(
      { success: false, message: "Could not load borrowed books." },
      { status: 500 }
    );
  }
}