"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 shrink-0">
        <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" fill="white" />
            <rect x="8" y="1" width="5" height="5" fill="white" />
            <rect x="1" y="8" width="5" height="5" fill="white" />
            <rect x="8" y="8" width="5" height="5" fill="white" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold tracking-[0.1em] text-gray-900 leading-none">
            LONGFORM
          </p>
          <p className="text-[10px] text-gray-400 tracking-wider leading-none mt-0.5">
            AI CONTENT GENERATOR
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Link
          href="/"
          className={clsx(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            pathname === "/"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Generate
        </Link>
        <Link
          href="/archive"
          className={clsx(
            "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
            pathname?.startsWith("/archive")
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          Archive
        </Link>
      </nav>

      {/* Status dot */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-gray-400 hidden sm:block">
          Kimi K2.5 · GPT Image
        </span>
      </div>
    </header>
  );
}
