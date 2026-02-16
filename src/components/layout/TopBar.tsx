"use client";

import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/firebase/auth";
import { LogOut } from "lucide-react";

export function TopBar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-14 items-center justify-between px-4">
        <h1 className="text-lg font-bold text-gray-900">HomeWithDeepak</h1>
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt=""
              className="h-8 w-8 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <button
            onClick={() => signOut()}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
