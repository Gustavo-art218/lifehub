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
  orderBy,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function SubscriptionsPage() {

  const [serviceName, setServiceName] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [renewalDate, setRenewalDate] =
    useState("");

  const [subscriptions, setSubscriptions] =
    useState<any[]>([]);

 useEffect(() => {

  const unsubscribeAuth =
    onAuthStateChanged(
      auth,
      (user) => {

        if (!user) return;

        const q = query(
        collection(db, "subscriptions"),
      where("userId", "==", user.uid)
      
    );

        const unsubscribeData =
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

              setSubscriptions(
                items
              );

            }
          );

        return () =>
          unsubscribeData();

      }
    );

  return () =>
    unsubscribeAuth();

}, []);

const addSubscription = async () => {
  console.log("Add Subscription clicked");

  if (
    !serviceName ||
    !price ||
    !renewalDate
  ) {
    alert("Complete all fields");
    return;
  }

  try {

   const user = auth.currentUser;

if (!user) {
  alert("Please login again");
  return;
}

await addDoc(
  collection(db, "subscriptions"),
  {
    userId: user.uid,
    serviceName,
    price: Number(price),
    renewalDate,
    status: "Active",
    createdAt: new Date(),
  }
);

    setServiceName("");
    setPrice("");
    setRenewalDate("");

    alert(
      "Subscription saved successfully"
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to save subscription"
    );

  }

};

const toggleSubscriptionStatus = async (
  subscriptionId: string,
  currentStatus: string
) => {

  try {

    await updateDoc(
      doc(
        db,
        "subscriptions",
        subscriptionId
      ),
      {
        status:
          currentStatus === "Active"
            ? "Cancelled"
            : "Active",
      }
    );

  } catch (error) {

    console.error(error);

    alert(
      "Failed to update subscription"
    );

  }

};

  return (
    <AuthGuard>
    <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
           Subscriptions
        </h1>

          <p className="text-slate-500 mt-2">
            Manage recurring subscriptions
          </p>

        </div>

        {/* ADD SUBSCRIPTION */}

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Add Subscription
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Netflix"
              value={serviceName}
              onChange={(e) =>
                setServiceName(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="number"
              placeholder="15"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <input
              type="date"
              value={renewalDate}
              onChange={(e) =>
                setRenewalDate(
                  e.target.value
                )
              }
              className="w-full border rounded-2xl p-4"
            />

            <button
  onClick={addSubscription}
              className="bg-slate-900 text-white px-6 py-3 rounded-2xl"
            >
              Save Subscription
            </button>

          </div>

        </div>

        {/* SAVED SUBSCRIPTIONS */}

        <div className="bg-white rounded-3xl p-6 shadow-lg">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-2xl font-bold">
              Active Subscriptions
            </h2>

            <span className="text-slate-500">
              {
                subscriptions.length
              }{" "}
              Total
            </span>

          </div>

          {subscriptions.length === 0 ? (

            <p className="text-slate-500">
              No subscriptions yet.
            </p>

          ) : (

            <div className="space-y-4">

              {subscriptions.map(
                (subscription) => (

                  <div
                    key={
                      subscription.id
                    }
                    className="border rounded-2xl p-5 flex justify-between items-center"
                  >

                    <div>

                      <h3 className="font-bold text-lg">
                        {
                          subscription.serviceName
                        }
                      </h3>

                      <p className="text-slate-500">
                        Renews:
                        {" "}
                        {
                          subscription.renewalDate
                        }
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-xl">
                        $
                        {Number(
                          subscription.price
                        ).toLocaleString()}
                        /month
                      </p>

                      <div className="mt-2">

  <span
    className={
      subscription.status === "Active"
        ? "text-green-600"
        : "text-red-600"
    }
  >
    {subscription.status}
  </span>

  <button
    onClick={() =>
      toggleSubscriptionStatus(
        subscription.id,
        subscription.status
      )
    }
    className="block mt-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm"
  >
    {subscription.status === "Active"
      ? "Cancel Subscription"
      : "Reactivate"}
  </button>

</div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        <BottomNav />

      </main>

    </div>
    </AuthGuard>
  );
}