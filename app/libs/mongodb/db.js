import clientPromise from "./mongodb";


const DB_NAME = "testRouteDB";

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

// Collections (centralized)
export async function usersCollection() {
  const db = await getDb();
  return db.collection("users");
}
