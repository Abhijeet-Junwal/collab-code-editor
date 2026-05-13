import mongoose from "mongoose";
import "../utils/env";

const DB_NAME = process.env.DB_NAME;
const MONGODB_URI = process.env.MONGODB_URI;

const buildMongoUri = (baseUri?: string, dbName?: string): string | undefined => {
  if (!baseUri) {
    return undefined;
  }

  // If the URI already includes a database path, keep it as-is.
  try {
    const parsed = new URL(baseUri);
    if (parsed.pathname && parsed.pathname !== "/") {
      return baseUri;
    }
  } catch {
    // If parsing fails, fall back to simple string handling below.
  }

  if (!dbName) {
    return baseUri;
  }

  const trimmed = baseUri.replace(/\/+$/, "");
  return `${trimmed}/${dbName}`;
};
const connectDB = async (): Promise<void> => {
  try {
    const uri = buildMongoUri(MONGODB_URI, DB_NAME);
    if (!uri) {
      throw new Error("Missing MONGODB_URI");
    }

    const connection = await mongoose.connect(uri);
    console.log(
      `Database connected succesfully ! \n Name: ${connection.connection.name}`
    );
  } catch (error) {
    console.log(`Database not connected, ${error}`);
    process.exit(1);
  }
};

export default connectDB;
