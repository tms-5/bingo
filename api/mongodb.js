import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI não está definida');
  }

  const client = new MongoClient(uri);
  await client.connect();
  
  const db = client.db('bingo');
  
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

