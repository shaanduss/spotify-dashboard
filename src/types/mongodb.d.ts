import { MongoClient } from "mongodb";

declare global {
  // Extends the globalThis type with the _mongoClientPromise property
  var _mongoClientPromise: Promise<MongoClient>;
}

export {};
