"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";
import { auth, db } from "@/lib/firebase";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

export default function ProfilePage() {

  const [email, setEmail] =
    useState("Loading...");

  const [userName, setUserName] =
    useState("LifeHub User");

  const [billCount, setBillCount] =
    useState(0);

  const [subscriptionCount, setSubscriptionCount] =
    useState(0);

  const [documentCount, setDocumentCount] =
    useState(0);

  const [maintenanceCount, setMaintenanceCount] =
    useState(0);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          if (!user) {

            setEmail(
              "Not Logged In"
            );

            return;
          }

          setEmail(
            user.email || "No Email"
          );

          if (user.email) {

            const name =
              user.email.split("@")[0];

            setUserName(name);

          }

        }
      );

    return () =>
      unsubscribe();

  }, []);

  useEffect(() => {

    const unsubBills =
      onSnapshot(
        collection(db, "bills"),
        (snapshot) =>
          setBillCount(
            snapshot.size
          )
      );

    const unsubSubs =
      onSnapshot(
        collection(
          db,
          "subscriptions"
        ),
        (snapshot) =>
          setSubscriptionCount(
            snapshot.size
          )
      );

    const unsubDocs =
      onSnapshot(
        collection(
          db,
          "documents"
        ),
        (snapshot) =>
          setDocumentCount(
            snapshot.size
          )
      );

    const unsubMaintenance =
      onSnapshot(
        collection(
          db,
          "maintenance"
        ),
        (snapshot) =>
          setMaintenanceCount(
            snapshot.size
          )
      );

    return () => {

      unsubBills();
      unsubSubs();
      unsubDocs();
      unsubMaintenance();

    };

  }, []);

  const logoutUser = async () => {

    try {

      await signOut(auth);

      window.location.href =
        "/login";

    } catch (error) {

      console.error(error);

      alert("Logout failed");

    }

  };

  return (

    <AuthGuard>

      <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-slate-100 p-6 pb-24">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Profile
          </h1>

          <p className="text-slate-500 mt-2">
            Manage your account
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6">

          <h2 className="text-2xl font-bold mb-6">
            Account Information
          </h2>

          <div className="space-y-4">

            <div>

              <p className="text-slate-500 text-sm">
                Full Name
              </p>

              <p className="font-semibold">
                {userName}
              </p>

            </div>

            <div>

              <p className="text-slate-500 text-sm">
                Email Address
              </p>

              <p className="font-semibold">
                {email}
              </p>

            </div>

            <div>

              <p className="text-slate-500 text-sm">
                Member Status
              </p>

              <p className="font-semibold text-green-600">
                Active
              </p>

            </div>

            <div className="pt-6">

              <button
                onClick={logoutUser}
                className="bg-red-600 text-white px-6 py-3 rounded-2xl"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 mt-6">

          <h2 className="text-2xl font-bold mb-6">
            Account Statistics
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <div className="border rounded-2xl p-4">

              <p className="text-slate-500">
                Bills
              </p>

              <p className="text-2xl font-bold">
                {billCount}
              </p>

            </div>

            <div className="border rounded-2xl p-4">

              <p className="text-slate-500">
                Subscriptions
              </p>

              <p className="text-2xl font-bold">
                {subscriptionCount}
              </p>

            </div>

            <div className="border rounded-2xl p-4">

              <p className="text-slate-500">
                Documents
              </p>

              <p className="text-2xl font-bold">
                {documentCount}
              </p>

            </div>

            <div className="border rounded-2xl p-4">

              <p className="text-slate-500">
                Maintenance
              </p>

              <p className="text-2xl font-bold">
                {maintenanceCount}
              </p>

            </div>

          </div>

        </div>

        <BottomNav />

      </main>

    </div>
    
</AuthGuard>
  );

}