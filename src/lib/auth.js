import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is missing from environment variables");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing");
}

const globalForMongo = globalThis;

const client =
  globalForMongo.mongoClient ??
  new MongoClient(MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
  });

globalForMongo.mongoClient = client;

// Separate authentication database
const db = client.db("booknook_users");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL:
    process.env.BETTER_AUTH_URL || "http://localhost:3000",

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean),

  emailAndPassword: {
    enabled: true,

    minPasswordLength: 8,

    maxPasswordLength: 128,

    autoSignIn: true,

    requireEmailVerification: false,
  },
});