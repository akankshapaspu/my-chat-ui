// lib/mongodb.js
import { MongoClient } from "mongodb";

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to your env");
}

client = new MongoClient(process.env.MONGODB_URI);
clientPromise = client.connect();

export default clientPromise;
