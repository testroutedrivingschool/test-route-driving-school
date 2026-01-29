import { countersCollection } from "../mongodb/db";


export async function getNextInvoiceNo() {
  const col = await countersCollection();

  const res = await col.findOneAndUpdate(
    { _id: "invoiceNo" },
    { $inc: { seq: 1 } },
    {
      upsert: true,
      returnDocument: "after", // MongoDB Node driver v4+
    }
  );

  // ✅ Some environments return { value }, some return { ...doc }
  const doc = res?.value || res;

  // If still missing, read it directly
  if (!doc?.seq) {
    const fallback = await col.findOne({ _id: "invoiceNo" });
    if (!fallback?.seq) {
      // initialize if needed
      await col.updateOne({ _id: "invoiceNo" }, { $set: { seq: 1 } }, { upsert: true });
      return 1;
    }
    return fallback.seq;
  }

  return doc.seq;
}
