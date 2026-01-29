"use client";

export default function ClientNotes({ clientId }) {
  return (
    <div className="bg-white border border-border-color rounded-md p-6">
      <h2 className="text-lg font-semibold">Notes</h2>
      <p className="mt-2 text-sm text-gray-600">
        ClientId: {clientId} (connect notes CRUD later)
      </p>
    </div>
  );
}
