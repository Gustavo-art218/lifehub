"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";

import { db } from "@/lib/firebase";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export default function Home() {

  const [bills, setBills] =
    useState<any[]>([]);

  useEffect(() => {

    const unsubscribe =
      onSnapshot(
        collection(db, "bills"),
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

  const paidBills =
    bills.filter(
      (bill) =>
        bill.status === "Paid"
    ).length;

  const unpaidBills =
    bills.filter(
      (bill) =>
        bill.status !== "Paid"
    ).length;

  const totalDue =
    bills
      .filter(
        (bill) =>
          bill.status !== "Paid"
      )
      .reduce(
        (sum, bill) =>
          sum + Number(bill.amount || 0),
        0
      );

  return (

    <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Your LifeHub overview
          </p>

        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-slate-500 mb-2">
              Total Bills
            </h2>

            <p className="text-3xl font-bold">
              {bills.length}
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-slate-500 mb-2">
              Paid Bills
            </h2>

            <p className="text-3xl font-bold text-green-600">
              {paidBills}
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-slate-500 mb-2">
              Unpaid Bills
            </h2>

            <p className="text-3xl font-bold text-red-600">
              {unpaidBills}
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-slate-500 mb-2">
              Total Due
            </h2>

            <p className="text-3xl font-bold">
              ${totalDue.toLocaleString()}
            </p>

          </div>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <h2 className="text-2xl font-bold mb-4">
            Recent Bills
          </h2>

          {bills.length === 0 ? (

            <p className="text-slate-500">
              No bills added yet.
            </p>

          ) : (

            <div className="space-y-4">

              {bills
                .slice(0, 5)
                .map((bill) => (

                  <div
                    key={bill.id}
                    className="border rounded-2xl p-4 flex justify-between items-center"
                  >

                    <div>

                      <p className="font-bold">
                        {bill.billName}
                      </p>

                      <p className="text-slate-500 text-sm">
                        Due: {bill.dueDate}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold">
                        ${Number(
                          bill.amount
                        ).toLocaleString()}
                      </p>

                      <p
                        className={
                          bill.status === "Paid"
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {bill.status}
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

  );
}