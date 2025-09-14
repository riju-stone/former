"use client";

import Link from "next/link";

export default function HomePage() {
  return <div className="w-screen h-screen flex flex-col items-center justify-center">
    <h1 className="text-8xl font-bold">Former</h1>
    <h2 className="text-2xl font-bold mb-4">A simple form builder</h2>
    <Link href="/dashboard/home" className="text-blue-500 underline">
      Go to Dashboard
    </Link>
  </div>;
}