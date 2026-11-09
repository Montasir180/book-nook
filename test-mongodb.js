import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
  throw new Error("MONGO_URI not found!");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
});

async function testConnection() {
  try {
    console.log("Connecting to MongoDB...");

    await client.connect();

    console.log("MongoDB Connected Successfully!");

    const db = client.db("booknook_users");

    const result = await db.command({
      ping: 1,
    });

    console.log("Ping Result:", result);

  } catch (error) {
    console.error("MongoDB Connection Failed!");
    console.error("Error:", error.message);
    console.error("Code:", error.code);

  } finally {
    await client.close();
  }
}

testConnection();