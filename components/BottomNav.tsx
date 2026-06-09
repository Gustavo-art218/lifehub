"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg flex justify-around py-3 z-50">

      <Link href="/dashboard">
        <div className="text-center text-sm">
          🏠
          <p>Home</p>
        </div>
      </Link>

      <Link href="/bills">
        <div className="text-center text-sm">
          💳
          <p>Bills</p>
        </div>
      </Link>

      <Link href="/subscriptions">
        <div className="text-center text-sm">
          📺
          <p>Subs</p>
        </div>
      </Link>

      <Link href="/documents">
        <div className="text-center text-sm">
          📄
          <p>Docs</p>
        </div>
      </Link>

      <Link href="/profile">
        <div className="text-center text-sm">
          👤
          <p>Profile</p>
        </div>
      </Link>

    </nav>
  );
}