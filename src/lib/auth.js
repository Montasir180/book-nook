
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

// Validate environment variables
if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is missing from .env.local");
}

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is missing from .env.local");
}

// MongoDB Client Singleton
const globalForMongo = globalThis;

const client =
  globalForMongo.mongoClient ||
  new MongoClient(process.env.MONGO_URI);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

// Database
const db = client.db("booknook_user");

// Better Auth
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ["user:email"],
    },
  },
});

