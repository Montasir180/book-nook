import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// MongoDB Connection
const client = new MongoClient(process.env.MONGO_URI);

export const db = client.db("booknook_user");

// Better Auth Configuration
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  trustedOrigins: [
    "http://localhost:3000",
  ],

  // Email & Password Authentication
  emailAndPassword: {
    enabled: true,

    minPasswordLength: 6,

    requireEmailVerification: false,
  },

  // Social Authentication
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});