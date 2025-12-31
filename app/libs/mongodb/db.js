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

export async function instructorsCollection() {
  const db = await getDb();
  return db.collection("instructors");
}
export async function packagesCollection() {
  const db = await getDb();
  return db.collection("packages");
}
export async function bookingsCollection() {
  const db = await getDb();
  return db.collection("bookings");
}
export async function reviewsCollection() {
  const db = await getDb();
  return db.collection("reviews");
}
export async function locationsCollection() {
  const db = await getDb();
  return db.collection("locations");
}
export async function announcementsCollection() {
  const db = await getDb();
  return db.collection("announcements");
}
export async function couponsCollection() {
  const db = await getDb();
  return db.collection("coupons");
}
