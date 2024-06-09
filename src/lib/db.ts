import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Helper function to create a new MongoClient and connect
const createClient = async () => {
  client = new MongoClient(uri);
  await client.connect();
  return client;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the client across module reloads caused by HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, create a new MongoClient and connect
  clientPromise = createClient();
}

export default clientPromise;
