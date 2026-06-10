"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

export default function DashboardPage() {

  const [bills, setBills] =
    useState<any[]>([]);

  const [subscriptions, setSubscriptions] =
    useState<any[]>([]);

  const [documents, setDocuments] =
    useState<any[]>([]);

  const [maintenance, setMaintenance] =
    useState<any[]>([]);

 useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user) return;

        const billsQuery =
          query(
            collection(db, "bills"),
            where(
              "userId",
              "==",
              user.uid
            )
          );

        const subscriptionsQuery =
          query(
            collection(
              db,
              "subscriptions"
            ),
            where(
              "userId",
              "==",
              user.uid
            )
          );

        const documentsQuery =
          query(
            collection(
              db,
              "documents"
            ),
            where(
              "userId",
              "==",
              user.uid
            )
          );

        const maintenanceQuery =
          query(
            collection(
              db,
              "maintenance"
            ),
            where(
              "userId",
              "==",
              user.uid
            )
          );

        const unsubBills =
          onSnapshot(
            billsQuery,
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

              setBills(items);

            }
          );

        const unsubSubscriptions =
          onSnapshot(
            subscriptionsQuery,
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

              setSubscriptions(
                items
              );

            }
          );

        const unsubDocuments =
          onSnapshot(
            documentsQuery,
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

        const unsubMaintenance =
          onSnapshot(
            maintenanceQuery,
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

              setMaintenance(
                items
              );

            }
          );

        return () => {

          unsubBills();
          unsubSubscriptions();
          unsubDocuments();
          unsubMaintenance();

        };

      }
    );

  return () =>
    unsubscribeAuth();

}, []);

  const unpaidBills =
    bills.filter(
      (bill) =>
        bill.status !== "Paid"
    );

  const activeSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.status === "Active"
    );

  const pendingMaintenance =
    maintenance.filter(
      (task) =>
        task.status !== "Completed"
    );

  return (

 <AuthGuard>

    <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-slate-900">
            Welcome Back
          </h1>

          <p className="text-slate-500 mt-2">
            Your LifeHub overview
          </p>

        </div>

        {/* SUMMARY */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-slate-500">
              Bills Due
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {unpaidBills.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-slate-500">
              Active Subscriptions
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {activeSubscriptions.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-slate-500">
              Documents
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {documents.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6">

            <p className="text-slate-500">
              Maintenance
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {pendingMaintenance.length}
            </h2>

          </div>

        </div>

        {/* RECENT BILLS */}

        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Recent Bills
          </h2>

          <div className="space-y-3">

            {bills.slice(0, 5).map((bill) => (

              <div
                key={bill.id}
                className="border rounded-2xl p-4 flex justify-between"
              >

                <div>

                  <p className="font-semibold">
                    {bill.billName}
                  </p>

                  <p className="text-slate-500 text-sm">
                    Due: {bill.dueDate}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-bold">
                    ${bill.amount}
                  </p>

                  <p className="text-sm">
                    {bill.status}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

{/* ACTIVE SUBSCRIPTIONS */}

<div className="bg-white rounded-3xl shadow-lg p-6 mb-6">

  <h2 className="text-2xl font-bold mb-4">
    Active Subscriptions
  </h2>

  <div className="space-y-3">

    {activeSubscriptions
      .slice(0, 5)
      .map((subscription) => (

        <div
          key={subscription.id}
          className="border rounded-2xl p-4 flex justify-between"
        >

          <div>

            <p className="font-semibold">
              {subscription.serviceName}
            </p>

            <p className="text-slate-500 text-sm">
              Renews:
              {" "}
              {subscription.renewalDate}
            </p>

          </div>

          <div className="text-right">

            <p className="font-bold">
              $
              {subscription.price}
            </p>

            <p className="text-green-600 text-sm">
              {subscription.status}
            </p>

          </div>

        </div>

      ))}

  </div>

</div>

{/* EXPIRING DOCUMENTS */}

<div className="bg-white rounded-3xl shadow-lg p-6 mb-6">

  <h2 className="text-2xl font-bold mb-4">
    Important Documents
  </h2>

  <div className="space-y-3">

    {documents
      .slice(0, 5)
      .map((document) => (

        <div
          key={document.id}
          className="border rounded-2xl p-4 flex justify-between"
        >

          <div>

            <p className="font-semibold">
              {document.documentName}
            </p>

            <p className="text-slate-500 text-sm">
              Expires:
              {" "}
              {document.expiryDate}
            </p>

          </div>

        </div>

      ))}

  </div>

</div>

{/* UPCOMING MAINTENANCE */}

<div className="bg-white rounded-3xl shadow-lg p-6 mb-6">

  <h2 className="text-2xl font-bold mb-4">
    Upcoming Maintenance
  </h2>

  <div className="space-y-3">

    {maintenance
      .slice(0, 5)
      .map((task) => (

        <div
          key={task.id}
          className="border rounded-2xl p-4 flex justify-between"
        >

          <div>

            <p className="font-semibold">
              {task.taskName}
            </p>

            <p className="text-slate-500 text-sm">
              Due:
              {" "}
              {task.dueDate}
            </p>

          </div>

          <div>

            <span
              className={
                task.status === "Completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {task.status}
            </span>

          </div>

        </div>

      ))}

  </div>

</div>

<BottomNav />

      </main>

        </div>

  </AuthGuard>

  );

}