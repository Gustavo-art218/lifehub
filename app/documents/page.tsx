"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export default function DocumentsPage() {

  const [documentName, setDocumentName] =
    useState("");

  const [documentType, setDocumentType] =
    useState("");

  const [expiryDate, setExpiryDate] =
    useState("");

  const [documents, setDocuments] =
    useState<any[]>([]);

  useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user) return;

        const q = query(
          collection(db, "documents"),
          where(
            "userId",
            "==",
            user.uid
          )
        );

        const unsubscribeDocs =
          onSnapshot(
            q,
            (snapshot) => {

              const items: any[] = [];

              snapshot.forEach(
                (doc) => {

                  items.push({
                    id: doc.id,
                    ...doc.data(),
                  });

                }
              );

              setDocuments(
                items
              );

            }
          );

        return () =>
          unsubscribeDocs();

      }
    );

  return () =>
    unsubscribeAuth();

}, []);

  const addDocument = async () => {

    if (
      !documentName ||
      !documentType ||
      !expiryDate
    ) {
      alert("Complete all fields");
      return;
    }

    try {

      const user = auth.currentUser;

if (!user) {
  alert("Not logged in");
  return;
}

await addDoc(
  collection(db, "documents"),
  {
    userId: user.uid,
    documentName,
    documentType,
    expiryDate,
    createdAt: new Date(),
  }
);

      setDocumentName("");
      setDocumentType("");
      setExpiryDate("");

      alert("Document Added");

    } catch (error) {

      console.error(error);

      alert("Failed to save document");

    }

  };

  return (

    <AuthGuard>

      <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Documents
          </h1>

          <p className="text-slate-500 mt-2">
            Manage important records
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Add Document
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Passport"
              value={documentName}
              onChange={(e) =>
                setDocumentName(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="text"
              placeholder="Government ID"
              value={documentType}
              onChange={(e) =>
                setDocumentType(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="date"
              value={expiryDate}
              onChange={(e) =>
                setExpiryDate(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <button
              onClick={addDocument}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl"
            >
              Save Document
            </button>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Stored Documents
            </h2>

            <span className="text-slate-500">
              {documents.length} Total
            </span>

          </div>

          {documents.length === 0 ? (

            <p className="text-slate-500">
              No documents added yet.
            </p>

          ) : (

            <div className="space-y-4">

              {documents.map((document) => (

                <div
                  key={document.id}
                  className="border rounded-2xl p-5 flex justify-between items-center"
                >

                  <div>

  <h3 className="font-bold text-lg">
    {document.documentName}
  </h3>

  <p className="text-slate-500">
    {document.documentType}
  </p>

  <p
    className={`mt-2 text-sm font-medium ${
      new Date(document.expiryDate) < new Date()
        ? "text-red-600"
        : (
            (new Date(document.expiryDate).getTime() -
              new Date().getTime()) /
            (1000 * 60 * 60 * 24)
          ) <= 30
        ? "text-yellow-600"
        : "text-green-600"
    }`}
  >
    {new Date(document.expiryDate) < new Date()
      ? "❌ Expired"
      : (
          (new Date(document.expiryDate).getTime() -
            new Date().getTime()) /
          (1000 * 60 * 60 * 24)
        ) <= 30
      ? "⚠️ Expires within 30 days"
      : "✅ Valid"}
  </p>

</div>

                  <div className="text-right">

                    <p className="font-medium">
                      Expires:
                    </p>

                    <p className="text-slate-500">
                      {document.expiryDate}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        <BottomNav />

      </main>

    </div>
</AuthGuard>
  );
}