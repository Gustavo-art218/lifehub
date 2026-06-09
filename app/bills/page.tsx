"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function BillsPage() {
  const [billName, setBillName] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [bills, setBills] =
    useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "bills"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: any[] = [];

        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setBills(items);
      }
    );

    return () => unsubscribe();
  }, []);

  const addBill = async () => {
    if (!billName || !amount || !dueDate) {
      alert("Complete all fields");
      return;
    }

    try {
      await addDoc(
        collection(db, "bills"),
        {
          billName,
          amount: Number(amount),
          dueDate,
          status: "Unpaid",
          createdAt: new Date(),
        }
      );

      setBillName("");
      setAmount("");
      setDueDate("");

      alert("Bill Added");
    } catch (error) {
      console.error(error);
      alert("Failed to save bill");
    }
  };
const markPaid = async (
  billId: string
) => {

  try {

    await updateDoc(
      doc(db, "bills", billId),
      {
        status: "Paid",
      }
    );

  } catch (error) {

    console.error(error);

    alert("Failed to update bill");

  }

};
  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Bills
          </h1>

          <p className="text-slate-500 mt-2">
            Manage upcoming payments
          </p>

        </div>

        {/* ADD BILL */}

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Add Bill
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Bill Name"
              value={billName}
              onChange={(e) =>
                setBillName(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) =>
                setDueDate(e.target.value)
              }
              className="w-full border rounded-2xl p-4"
            />

            <button
              onClick={addBill}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl"
            >
              Save Bill
            </button>

          </div>

        </div>

        {/* SAVED BILLS */}

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Upcoming Bills
            </h2>

            <span className="text-slate-500">
              {bills.length} Bills
            </span>

          </div>

          {bills.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-slate-500">
                No bills added yet
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {bills.map((bill) => (

                <div
                  key={bill.id}
                  className="border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between"
                >

                  <div>

                    <h3 className="font-bold text-lg">
                      {bill.billName}
                    </h3>

                    <p className="text-slate-500 mt-1">
                      Due: {bill.dueDate}
                    </p>

                  </div>

                  <div className="mt-4 md:mt-0 md:text-right">

                    <p className="font-bold text-xl">
                      ${Number(
                        bill.amount
                      ).toLocaleString()}
                    </p>

                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm bg-red-100 text-red-700">
                      <span
  className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
    bill.status === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {bill.status}
</span>

{bill.status !== "Paid" && (
  <button
    onClick={() => markPaid(bill.id)}
    className="block mt-3 bg-green-600 text-white px-4 py-2 rounded-xl"
  >
    Mark Paid
  </button>
)}
                    </span>

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