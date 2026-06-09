"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white min-h-screen p-6">

      <h1 className="text-3xl font-bold mb-10">
        LifeHub
      </h1>

      <nav className="flex flex-col gap-3">

        <Link
          href="/dashboard"
          className="p-3 rounded-xl hover:bg-slate-800"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="/bills"
          className="p-3 rounded-xl hover:bg-slate-800"
        >
          💳 Bills
        </Link>

        <Link
          href="/subscriptions"
          className="p-3 rounded-xl hover:bg-slate-800"
        >
          📺 Subscriptions
        </Link>

        <Link
          href="/documents"
          className="p-3 rounded-xl hover:bg-slate-800"
        >
          📄 Documents
        </Link>

        <Link
          href="/maintenance"
          className="p-3 rounded-xl hover:bg-slate-800"
        >
          🔧 Maintenance
        </Link>

        <Link
          href="/profile"
          className="p-3 rounded-xl hover:bg-slate-800"
        >
          👤 Profile
        </Link>

      </nav>

    </aside>
  );
}