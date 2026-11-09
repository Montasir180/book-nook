import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI is missing");
}

const globalForMongo = globalThis;

const client =
  globalForMongo.borrowMongoClient ||
  new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.borrowMongoClient = client;
}

export async function getBorrowDatabase() {
  await client.connect();

  return client.db("booknookdatabase");
}

export { client as borrowMongoClient };