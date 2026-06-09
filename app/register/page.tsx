"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const registerUser = async () => {

    if (!email || !password) {
      alert("Complete all fields");
      return;
    }

    try {

      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account created successfully");

      router.push("/login");

    } catch (error: any) {

      alert(error.message);

    }

    setLoading(false);

  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">

        <h1 className="text-4xl font-bold mb-2">
          Create Account
        </h1>

        <p className="text-slate-500 mb-8">
          Join LifeHub
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border border-slate-300 rounded-2xl p-4"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border border-slate-300 rounded-2xl p-4"
          />

          <button
            onClick={registerUser}
            disabled={loading}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 font-semibold"
          >

            {loading
              ? "Creating Account..."
              : "Create Account"}

          </button>

        </div>

      </div>

    </main>
  );
}