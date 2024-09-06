import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const database = new MongoClient(process.env.MONGODB_URI);

export async function databaseConnection() {
  try {
    await database.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

export function getDatabase() {
  return database.db('chatterbox');
}