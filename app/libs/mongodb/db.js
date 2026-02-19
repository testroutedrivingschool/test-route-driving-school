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

export async function instructorsFilesCollection() {
  const db = await getDb();
  return db.collection("instructor_files");
}
export async function packagesCollection() {
  const db = await getDb();
  return db.collection("packages");
}
export async function purchasesCollection() {
  const db = await getDb();
  return db.collection("purchases");
}
export async function bookingsCollection() {
  const db = await getDb();
  return db.collection("bookings");
}
export async function instructorSlotsCollection() {
  const db = await getDb();
  return db.collection("instructorSlots");
}
export async function clientsCollection() {
  const db = await getDb();
  return db.collection("clients");
}
export async function clientsChecklistsCollection() {
  const db = await getDb();
  return db.collection("client_checklists");
}
export async function notesCollection() {
  const db = await getDb();
  return db.collection("notes");
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

export async function invoicesCollection() {
  const db = await getDb();
  return db.collection("invoices");
}

export async function countersCollection() {
  const db = await getDb();
  return db.collection("counters");
}

export async function emailsCollection() {
    const db = await getDb();
   return db.collection("emails");
}

export async function storageFilesCollection() {
  const db = await getDb();
  return db.collection("storage_files");
}
